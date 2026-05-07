export class AuthResponse {
  private token: string | null;

  constructor(token: string | null) {
    this.token = token;
  }
}
