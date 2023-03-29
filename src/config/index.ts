if (process.env.NODE_ENV !== 'production') {
    if (process.env.NODE_ENV === 'test') {
        require("dotenv").config({ path: "test.env" });
    } else {
        require("dotenv").config();
    }
}
export interface IConfig {
    PORT: number;
    MONGO_URI: string;
    APPLICATION_NAME: string;
    JWT_SECRET: string;
  }

export const Config: IConfig = {
    PORT: +process.env.PORT!|| 5000,
    MONGO_URI: process.env.MONGO_URI || "",
    APPLICATION_NAME: process.env.APPLICATION_NAME || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
};