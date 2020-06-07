/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// noinspection ES6PreferShortImport
import { AbstractType, Type } from '../interface/type';
import { InjectionToken } from '../injection_token';
import { INJECTOR, NullInjector, THROW_IF_NOT_FOUND, ɵɵinject } from './injector_compatibility';
import { ɵɵdefineInjectable } from '../interface/defs';
// noinspection ES6PreferShortImport
import { InjectFlags } from '../interface/injector';
// noinspection ES6PreferShortImport
import {
  Provider,
  StaticProvider,
} from '../interface/provider';

export const Factory: {
  resolveAndCreate: (providers: Provider[], parent?: Injector) => Injector,
  create: (providers: StaticProvider[], parent: Injector | undefined, name: string) => Injector
} = {
  create: () => { throw new Error() },
  resolveAndCreate: () => { throw new Error() },
}

/**
 * Concrete injectors implement this interface. Injectors are configured
 * with [providers](guide/glossary#provider) that associate
 * dependencies of various types with [injection tokens](guide/glossary#di-token).
 *
 * @see ["DI Providers"](guide/dependency-injection-providers).
 * @see `StaticProvider`
 *
 * @usageNotes
 *
 *  The following example creates a service injector instance.
 *
 * {@example core/di/ts/provider_spec.ts region='ConstructorProvider'}
 *
 * ### Usage example
 *
 * {@example core/di/ts/injector_spec.ts region='Injector'}
 *
 * `Injector` returns itself when given `Injector` as a token:
 *
 * {@example core/di/ts/injector_spec.ts region='injectInjector'}
 *
 * @publicApi
 */
export abstract class Injector {
  static THROW_IF_NOT_FOUND = THROW_IF_NOT_FOUND;
  static NULL: Injector = new NullInjector();

  /**
   * Retrieves an instance from the injector based on the provided token.
   * @returns The instance from the injector if defined, otherwise the `notFoundValue`.
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   */
  abstract get<T>(
      token: Type<T> | InjectionToken<T> | AbstractType<T>, notFoundValue?: T, flags?: InjectFlags): T;

  /**
   * Creates a new injector instance that provides one or more dependencies,
   * according to a given type or types of `StaticProvider`.
   *
   * @param options An object with the following properties:
   * * `providers`: An array of providers of the [StaticProvider type](api/core/StaticProvider).
   * * `parent`: (optional) A parent injector.
   * * `name`: (optional) A developer-defined identifying name for the new injector.
   *
   * @returns The new injector instance.
   *
   */
  static create(options: { providers: StaticProvider[], parent?: Injector, name?: string}): Injector {
    return Factory.create(options.providers, options.parent, options.name || '');
  }


  /**
   * Resolves an array of providers and creates an injector from those providers.
   *
   * The passed-in providers can be an array of `Type`, `Provider`,
   * or a recursive array of more providers.
   *
   * @usageNotes
   * ### Example
   *
   * ```typescript
   * @Injectable()
   * class Engine {
   * }
   *
   * @Injectable()
   * class Car {
   *   constructor(public engine:Engine) {}
   * }
   *
   * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
   * expect(injector.get(Car) instanceof Car).toBe(true);
   * ```
   */
  static resolveAndCreate(providers: Provider[], parent?: Injector): Injector {
    return Factory.resolveAndCreate(providers, parent);
  }

  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: Injector,
    providedIn: 'any' as any,
    factory: () => ɵɵinject(INJECTOR),
  });

  /**
   * @internal
   * @nocollapse
   */
  static __NG_ELEMENT_ID__ = -1;
}
