import { MigrationEventTypes } from "@0xtender/evm-helpers";

type FCC<T = unknown> = React.FC<React.PropsWithChildren<T>>;

export type { FCC };
export type EventSearchKey = MigrationEventTypes["event_data"][number][number];
