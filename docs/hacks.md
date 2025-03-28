Hacky implementations/solutions in the codebase that might not make the most sense at first glance. The writing goes over the problem, the solution, and the reasoning behind the solution.

---

### Entries
1. Resume Uploads
    **Problem**: Resumes gotta be uploaded on file input change rather than on form submission to reduce submission latency. Plus upload errors happening on submission are unintuitive and confusing. After upload, the resume's public url has to be stored in the form state, not the name or any of the other metadata. This means making the input a controlled input is redundant. But it also means --since input isn't controlled-- the 'resumeUrl' field cannot be registered conventionally with react-hook-form (`...register()`,`Controller`) instead we have to use `setValue` to add the resumeUrl to the form. Conversely, react-hook-form doesn't offer a way to add validation rules to a field that isn't registered with it.
    **Solution**: Create an empty Controller component that registers the field with react-hook-form without actually rendering anything. Then use `setValue` to add the resumeUrl to the form. This way we can add validation rules to the field.