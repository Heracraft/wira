This is a [Next.js](https://nextjs.org) project built ontop of Supabase and Vercel.

### Getting Started
1. Populate .env with the necessary .env variables. You can duplicate .env.example to see whats up.
2. ...npm stuff

_If you are starting from a clean supabse project. Proceed with the following_

3. Delete previous migration files (`/supabase/migrations`) and generate a new migration and run it against the database to create the necessary tables.
4. Create 1 public storage bucket named `static`. It should give authed users WRITE access to `avatars` and `resumes` folders
5. Sync the auth config as outlined in [auth config.md](/docs/auth%20config.md)

### How certain things work (Maintainer docs)

+ [Hacks](/docs/hacks.md)
    A collection of hacky implementations in the codebase. The writing goes over the problem, the solution, and the reasoning behind the solution.
+ [File Structure](/docs/components%20&%20file-structure.md)
    A breakdown of the file structure of the project. The writing goes over the purpose of each directory and the files within them. Obvious design choices are ignored.

+ [ ] TODO: document infra
    - redis + supabse