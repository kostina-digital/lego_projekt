export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterPayload extends Credentials {
  email: string;
}

