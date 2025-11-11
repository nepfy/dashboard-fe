import { afterEach, describe, expect, it } from "vitest";
import { generateSubdomainUrl, getProjectBaseDomain } from "#/lib/subdomain";

const originalProjectBaseDomain = process.env.NEXT_PUBLIC_PROJECT_BASE_DOMAIN;

afterEach(() => {
  if (originalProjectBaseDomain === undefined) {
    delete process.env.NEXT_PUBLIC_PROJECT_BASE_DOMAIN;
  } else {
    process.env.NEXT_PUBLIC_PROJECT_BASE_DOMAIN = originalProjectBaseDomain;
  }
});

describe("subdomain helpers", () => {
  it("fallbacks to the default domain when env var is not set", () => {
    delete process.env.NEXT_PUBLIC_PROJECT_BASE_DOMAIN;

    expect(getProjectBaseDomain()).toBe("nepfy.com");
  });

  it("ignores protocols and trailing slashes from the env var", () => {
    process.env.NEXT_PUBLIC_PROJECT_BASE_DOMAIN =
      "HTTPS://Staging-App.Nepfy.com/";

    expect(getProjectBaseDomain()).toBe("staging-app.nepfy.com");
  });

  it("fallbacks to default when env var is empty", () => {
    process.env.NEXT_PUBLIC_PROJECT_BASE_DOMAIN = "   ";

    expect(getProjectBaseDomain()).toBe("nepfy.com");
  });

  it("generates proposal URL using the configured domain", () => {
    process.env.NEXT_PUBLIC_PROJECT_BASE_DOMAIN = "clientes.nepfy.dev";

    expect(generateSubdomainUrl("joao", "loja-test")).toBe(
      "https://joao-loja-test.clientes.nepfy.dev"
    );
  });
});

