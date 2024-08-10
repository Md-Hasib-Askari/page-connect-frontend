declare const FB: any;
declare const Cookies: Cookies.CookiesStatic & {
    // eslint-disable-next-line no-unused-vars
    get: (name: string) => string | undefined;
};