import NextAuth from "next-auth"

const { auth, handlers } = NextAuth({
  providers: [],
})

export { auth, handlers }
