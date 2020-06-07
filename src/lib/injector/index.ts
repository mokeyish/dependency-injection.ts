/**
 * Created by yish on 2020/06/06.
 */

import { Injector, Factory } from './injector';
// noinspection ES6PreferShortImport
import { Provider, StaticProvider } from '../interface/provider';
import { StaticInjector } from './static/static-injector';

import { createInjector } from './r3_injector';
import { normalizeProviders } from '../provider';

export function INJECTOR_IMPL__PRE_R3__(
    providers: StaticProvider[], parent: Injector | undefined, name: string) {
    return new StaticInjector(providers, parent, name);
}

Factory.resolveAndCreate = (providers: Provider[], parent?: Injector) => {
    return createInjector({ }, parent, normalizeProviders(providers));
};
Factory.create = INJECTOR_IMPL__PRE_R3__;

export { Injector };
