# Dependency Injection

> A lightweight, extensible dependency injection container for TypeScript/JavaScript.

1. Install

`yarn add ioc-di-ts`


2. Example

```ts

import { Injectable, Injector, INJECTOR_SCOPE } from 'ioc-di-ts';
@Injectable()
class Bar {
    name = 'abc';
}

@Injectable({ providedIn: 'root'})
class Foo {
    constructor(public bar: Bar) {
    }
}

const injector = Injector.resolveAndCreate([
        { provide: Bar },
        { provide: INJECTOR_SCOPE, useValue: 'root'}
        // { provide: Foo }
    ]
);

const foo = injector.get(Foo);
const bar = injector.get(Bar);
expect(foo.bar).toEqual(bar);
expect(foo.bar.name).toEqual('abc');

@Injectable({ providedIn: 'root'})
class Foo1 {
    constructor(public bar: Bar) {
    }
}

const injectorChild = Injector.resolveAndCreate( [
    { provide: Foo1, }
], injector)

const foo1 = injectorChild.get(Foo1);
expect(foo1.bar).toEqual(bar);
expect(foo1.bar.name).toEqual('abc');
```
