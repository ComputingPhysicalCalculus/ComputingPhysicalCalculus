import { Shaft } from "./Shaft";

export interface Device {
    getOutput() : Shaft | undefined;
}