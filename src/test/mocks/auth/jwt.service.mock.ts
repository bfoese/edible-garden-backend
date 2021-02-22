const mockedJwtService = {
  sign: <T>(payload: T): string => JSON.stringify(payload),
};

export default mockedJwtService;
