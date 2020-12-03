# Tell docker to use an official node image. Alpine images are lighter, but can have unexpected behaviour
# This is a multi stage build, therefore the 'as' statement to name the image
# Thanks to the multi-stage build feature, we can keep our final image (here called production) as slim as possible by
# keeping all the unnecessary bloat in the development image
# Here we install only devDependencies due to the container being used as a “builder” that takes all the necessary
# tools to build the application and later send a clean /dist folder to the production image.
FROM node:12.13-alpine as development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
# each following command will be executed from this context
WORKDIR /usr/src/app
# First copy package.json and package-lock.json
COPY package*.json ./
# second run npm install
RUN npm install --only=development
# Third the rest of the application files into the docker container
# The order of statements is very important here due to how Docker caches layers. Each statement in the Dockerfile
# generates a new image layer, which is cached.
# If we copied all files at once and then ran npm install, each file change would cause Docker to think it should run
# npm install all over again.
# By first copying only package*.json files, we are telling Docker that it should run npm install and all the commands
# appearing afterwards only when either package.json or package-lock.json files change.
COPY . .
# Finally, we make sure the app is built in the /dist folder. Since our application uses TypeScript and other
# build-time dependencies, we have to execute this command in the development image.
RUN npm run build


# By using the FROM statement again, we are telling Docker that it should create a new, fresh image without any
# connection to the previous one. This time we are naming it production.
FROM node:12.13-alpine as production

# ARG is for building the docker image and not available in the running container,
# ENV is available during build and in the running container and can change, after the image was built
# Here we are using the ARG statement to define the default value for NODE_ENV
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
# This time, we are making sure that we install only dependencies defined in dependencies in package.json by using
# the --only=production argument. This way we don’t install packages such as TypeScript that would cause our final
# image to increase in size.
RUN npm install --only=production

COPY . .
# Here we copy the built /dist folder from the development image. This way we are only getting the /dist directory,
# without the devDependencies, installed in our final image.
COPY --from=development /usr/src/app/dist ./dist

# Here we define the default command to execute when the image is run
CMD ["node", "dist/main"]


