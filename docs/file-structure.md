First of many documents to come. This document will be about the components and folder structure of the project. Hit `Ctrl + Shift + V` (Vscode) to view the markdown preview.

---

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

### Components
Since routes are defined by folders and files in Next.js, each folder in the `app` directory corresponds to a route. But only the `page.(js|jsx|ts|tsx)` file in the folder is the actual code for the route. This means we can colocate components used by said route.

So components only used by a specific route, can be colocated in the same folder as the route. This way we can avoid cluter in the `components` folder. So henceforth, the `components` folder will only contain shared components all else will be colocated.