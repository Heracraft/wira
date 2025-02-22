### File structure
+ /src/lib
	+ store(.server).ts
		`store.ts` and `store.server.ts` export global state and clients. With `.server.ts` including server only clients, stuff we don't want to leak to the client. An example of the clients exported are the supabase clients for the server and the client.
	+ utils.ts
		Shared utility functions. Strictly utility functions only.
+ /src/db
	Stores the schema files (`schema.ts`), and exports the postgres client via `index.ts`. `index.ts` is also a `server only` module. We don't want our database publicly available

+ /supabase/migrations
	Migrations for postgres db hosted on supabase
