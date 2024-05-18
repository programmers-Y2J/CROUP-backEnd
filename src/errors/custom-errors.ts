class MyError extends Error {
  public status;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ValidationError extends MyError {}

class NotFoundError extends MyError {}

export { MyError, ValidationError, NotFoundError };
