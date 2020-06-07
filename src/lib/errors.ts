/**
 * Created by yish on 2020/06/06.
 */

import { InjectorType } from './interface/defs';
import { stringify } from './util/stringify';

/** Called when directives inject each other (creating a circular dependency) */
export function throwCyclicDependencyError(token: any): never {
    throw new Error(`Cannot instantiate cyclic dependency! ${token}`);
}


export function throwInvalidProviderError(
    ngModuleType?: InjectorType<any>, providers?: any[], provider?: any) {
    let ngModuleDetail = '';
    if (ngModuleType && providers) {
        const providerDetail = providers.map(v => v === provider ? '?' + provider + '?' : '...');
        ngModuleDetail =
            ` - only instances of Provider and Type are allowed, got: [${providerDetail.join(', ')}]`;
    }

    throw new Error(
        `Invalid provider for the NgModule '${stringify(ngModuleType)}'` + ngModuleDetail);
}

export function throwMixedMultiProviderError() {
    throw new Error(`Cannot mix multi providers and regular providers`);
}

/**
 * Thrown when an object other then {@link Provider} (or `Type`) is passed to {@link Injector}
 * creation.
 *
 * @usageNotes
 * ### Example
 *
 * ```typescript
 * expect(() => Injector.resolveAndCreate(["not a type"])).toThrowError();
 * ```
 */
export function invalidProviderError(provider: any) {
    return Error(
        `Invalid provider - only instances of Provider and Type are allowed, got: ${provider}`);
}
