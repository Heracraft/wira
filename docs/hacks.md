Hacky implementations/solutions in the codebase that might not make the most sense at first glance. The writing goes over the problem, the solution, and the reasoning behind the solution.

---

### Entries

1. **Revalidating paths from the client**: `revalidatePath` from '`next/cache`' doesn't seem to be working when called from the client. I get this error: `Error: Invariant: static generation store missing in revalidatePath /`. But works perfectly when called from the server (server action/server component). The only time I seem to want to do this -- call revalidatePath from the client -- is when I am doing auth stuff. So i wrote a dummy server action that just calls revalidatePath from the server. Works for now. I might revisit this later. the server function is `revalidatePathFromClient` in `server.ts`.
