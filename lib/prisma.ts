type PrismaProxy = Record<string, any>

let _prisma: PrismaProxy | null = null

function createPrisma(): PrismaProxy {
  try {
    const { PrismaClient } = require("@prisma/client") as any
    return new PrismaClient()
  } catch {
    const handler: ProxyHandler<PrismaProxy> = {
      get(target, prop: string | symbol) {
        if (typeof prop === "string" && !(prop in target)) {
          target[prop] = new Proxy({} as PrismaProxy, handler)
        }
        return target[prop as string]
      },
      apply() {
        return Promise.resolve([])
      },
    }
    return new Proxy({} as PrismaProxy, handler)
  }
}

function getPrisma(): PrismaProxy {
  if (!_prisma) {
    _prisma = createPrisma()
  }
  return _prisma
}

export const prisma: PrismaProxy = new Proxy({} as PrismaProxy, {
  get(_, prop: string | symbol) {
    return getPrisma()[prop as string]
  },
})
