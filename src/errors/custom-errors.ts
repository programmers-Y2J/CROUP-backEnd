class MyError extends Error {
  public status;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ValidationError extends MyError {}

export { MyError, ValidationError };
