First of many documents to come. This document will be about the components and folder structure of the project. Hit `Ctrl + Shift + V` (Vscode) to view the markdown preview.

---

### File structure
+ /src/lib
	+ store(.server).ts:
		`store.ts` and `store.server.ts` export global state and clients. With `.server.ts` including server only clients, stuff we don't want to leak to the client. An example of the clients exported are the supabase clients for the server and the client.
	+ utils.ts:
		Shared utility functions. Strictly utility functions only.
+ /src/db:
	Stores the schema files (`schema.ts`), and exports the postgres client via `index.ts`. `index.ts` is also a `server only` module. We don't want our database publicly available

+ /supabase/migrations:
	Migrations for postgres db hosted on supabase

+ /archive:
	Implementations of features that are not used in the current version of the application but may be useful for future reference. This can include old routes, components, or logic that has been deprecated but not deleted.

### Components
Since routes are defined by folders and files in Next.js, each folder in the `app` directory corresponds to a route. But only the `page.(js|jsx|ts|tsx)` file in the folder is the actual code for the route. This means we can colocate components used by said route.

So components only used by a specific route, can be colocated in the same folder as the route. This way we can avoid cluter in the `components` folder. So henceforth, the `components` folder will only contain shared components all else will be colocated.

Lets take two routes as an example. `src/app/(platform)/pricing` and `src/app/(platform)/profile/[uid]`. Pricing uses a component called `PricingSection` from `@/components/PricingSection`. Why isn't the component collocated? because it is used across multiple routes: `/pricing`, `/onboarding` and `/limit-reached`. Collocating it with /pricing wouldn't make sense.

`src/app/(platform)/profile/[uid]` on the other hand includes the page itself (`page.tsx`) and `AddToWaitlist.tsx` which the route uses. The component isn't used else where therefore is collocated in the same page as the route definition. I hope this explains it.

# Route Groups
Whats the problem and what are route groups?.

The issue is not all pages can share the same root layout. So we need to separate them. *A layout is UI that is shared between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender*.  The layout for the marketing sections of the app might contain a header, auth and a footer while the main app will contain that except a footer and it might add things like a toaster and etc. Other parts of the platform like error and auth pages do not have a header nor a footer. You can Imagine handling all these conditions in one root layout will quickly get messy. So we'll keep them separate using route groups.


![Route groups](https://res.cloudinary.com/dpsyccfsa/image/upload/v1736305363/Sea%20Assets/vuxtpjajebtgt28ky4sk.avif)

So what are these `Route groups`? Route groups are basically folders that are not included in a route's URL. They are folders with parenthises in their name. For example, the folder `app/(marketing)` will not be included in the URL. So if we have a route `app/(marketing)/about` the URL will be `/about` not `/(marketing)/about`. They are purely for organization. The reason we are using them is because we can define different root layouts for different route groups like; (marketing), (platform) and (headless). 

You can read more in Next.js' documentaion. [Route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) [Layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages)