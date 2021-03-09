FROM node:14.15-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
# scripts are necessary for postinstall step
COPY ./scripts ./scripts

ARG GH_PKG_TOKEN

# Creates npmrc file on the fly to enable download of private packages from
# github package registry. npmrc file will be removed afterwards to not end up
# in the tarball of this command layer. Careful: the build argument
# $GH_PKG_TOKEN would show up in docker commit history of the image if the build
# would consist only of one stage, because the build steps of the  final stage
# will show up in the commit history.
#
# I don't know if npm ci also implicitly runs the postinstall script, therefore I
# do it explicitly. The postinstall script will fix the paths of the typeorm
# patch package.
RUN echo "//npm.pkg.github.com/:_authToken=${GH_PKG_TOKEN}" > .npmrc && \
    echo "@bfoese:registry=https://npm.pkg.github.com/" >> .npmrc && \
    echo "always-auth = true" >> .npmrc && \
    npm ci && npm run postinstall && rm -f .npmrc

# Copy the rest of the files
COPY . ./

# build the app and remove the dev dependencies from node_modules
# also apply patch script after pruning
RUN npm run build --prod && npm prune --production && npm run postinstall
# Create a second stage to make this a multi stage build: only the final build
# will show up in the commit history of the docker image. With this second
# stage, the secret $GH_PKG_TOKEN from previous stage is not going to be visible in
# the commit history of the image.
FROM node:14.15-alpine as production

WORKDIR /usr/src/app

# Copy the built /dist folder from the builder image
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
CMD ["node", "dist/src/main"]
