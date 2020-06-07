/**
 * Created by yish on 2020/06/06.
 */


import { Inject, Injectable, InjectionToken, Injector, Optional, INJECTOR_SCOPE } from 'ioc-di-ts';

describe('injectable', () => {
    it('001', () => {
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
    })
    it('Scope', () => {
        @Injectable({ providedIn: 'root'})
        class Bar {
            name = 'abc';
            constructor() {
            }
        }

        const injector1 = Injector.resolveAndCreate([
                { provide: INJECTOR_SCOPE, useValue: 'root'}
            ]
        );
        const bar1 = injector1.get(Bar);

        const injector2 = Injector.resolveAndCreate([
            ],
            injector1
        );
        const bar2 = injector2.get(Bar);

        expect(bar1 === bar2).toEqual(true);
    })
    it('NoProviderIn', () => {
        @Injectable()
        class Bar {
            name = 'abc';
        }

        const injector = Injector.resolveAndCreate([
                Bar
            ]
        );

        const bar = injector.get(Bar);
        expect(bar.name).toEqual('abc');
    })
    it('RootProvide001', () => {
        @Injectable({ providedIn: 'root'})
        class Bar {
            name = 'abc';
        }

        const injector = Injector.resolveAndCreate([
                { provide: INJECTOR_SCOPE, useValue: 'root'}
            ]
        );

        const bar = injector.get(Bar);
        expect(bar.name).toEqual('abc');
    })
    it('RootProvide002', () => {
        @Injectable()
        class Bar {
            name = 'abc';
        }

        const injector = Injector.resolveAndCreate([
                { provide: INJECTOR_SCOPE, useValue: 'root'}
            ]
        );

        expect(() => injector.get(Bar)).toThrow('NullInjectorError: No provider for Bar!');
    })
    it('InjectionToken', function () {
        interface Abc {
            name: string;
        }
        const ABC = new InjectionToken<Abc>('ss', {
            providedIn: 'any',
            factory() {
                return { name: 'test' }
            }
        })

        @Injectable({ providedIn: 'root'})
        class Foo {
            constructor(@Inject(ABC) public abc: Abc) {
            }
        }
        const injector = Injector.resolveAndCreate( [
            { provide: Foo, deps: [ ABC] }
        ]);

        const foo = injector.get(Foo);
        expect(foo).not.toBeNull();
        expect(foo.abc.name).toEqual('test');
    });
    it('Optional', () => {
        @Injectable({ providedIn: 'root'})
        class Bar {
            name = 'abc';
        }

        @Injectable({ providedIn: 'root'})
        class Foo {
            constructor(@Optional() public bar: Bar) {
            }
        }

        const injector = Injector.resolveAndCreate([
            { provide: Foo}
        ]);

        const foo = injector.get(Foo);
        expect(foo).not.toBeNull();
    })
})
