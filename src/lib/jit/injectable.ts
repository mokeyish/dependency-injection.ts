/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { getCompilerFacade, R3InjectableMetadataFacade } from '../compiler/compiler_facade';
// noinspection ES6PreferShortImport
import { Type } from '../interface/type';
import { getClosureSafeProperty } from '../util/property';
import { resolveForwardRef } from '../forward_ref';
import { Injectable } from '../injectable';
import { NG_PROV_DEF, NG_PROV_DEF_FALLBACK } from '../interface/defs';
// noinspection ES6PreferShortImport
import { ClassSansProvider, ExistingSansProvider, FactorySansProvider, ValueProvider, ValueSansProvider } from '../interface/provider';

import { angularCoreDiEnv } from './environment';
import { convertDependencies, reflectDependencies } from './util';



/**
 * Compile an Angular injectable according to its `Injectable` metadata, and patch the resulting
 * injectable def (`ɵprov`) onto the injectable type.
 */
export function compileInjectable(type: Type<any>, srcMeta?: Injectable): void {
  let ngInjectableDef: any = null;

  // if NG_PROV_DEF is already defined on this class then don't overwrite it
  if (!type.hasOwnProperty(NG_PROV_DEF)) {
    Object.defineProperty(type, NG_PROV_DEF, {
      get: () => {
        if (ngInjectableDef === null) {
          ngInjectableDef = getCompilerFacade().compileInjectable(
              angularCoreDiEnv, `ng:///${type.name}/ɵprov.js`,
              getInjectableMetadata(type, srcMeta));
        }
        return ngInjectableDef;
      },
    });

    // On IE10 properties defined via `defineProperty` won't be inherited by child classes,
    // which will break inheriting the injectable definition from a grandparent through an
    // undecorated parent class. We work around it by defining a method which should be used
    // as a fallback. This should only be a problem in JIT mode, because in AOT TypeScript
    // seems to have a workaround for static properties. When inheriting from an undecorated
    // parent is no longer supported (v11 or later), this can safely be removed.
    if (!type.hasOwnProperty(NG_PROV_DEF_FALLBACK)) {
      (type as any)[NG_PROV_DEF_FALLBACK] = () => (type as any)[NG_PROV_DEF];
    }
  }
}

type UseClassProvider = Injectable & ClassSansProvider & { deps?: any[]};

const USE_VALUE =
    getClosureSafeProperty<ValueProvider>({ provide: String, useValue: getClosureSafeProperty});

function isUseClassProvider(meta: Injectable): meta is UseClassProvider {
  return (meta as UseClassProvider).useClass !== undefined;
}

function isUseValueProvider(meta: Injectable): meta is Injectable & ValueSansProvider {
  return USE_VALUE in meta;
}

function isUseFactoryProvider(meta: Injectable): meta is Injectable & FactorySansProvider {
  return (meta as FactorySansProvider).useFactory !== undefined;
}

function isUseExistingProvider(meta: Injectable): meta is Injectable & ExistingSansProvider {
  return (meta as ExistingSansProvider).useExisting !== undefined;
}

function getInjectableMetadata(type: Type<any>, srcMeta?: Injectable): R3InjectableMetadataFacade {
  // Allow the compilation of a class with a `@Injectable()` decorator without parameters
  const meta: Injectable = srcMeta || { providedIn: null};
  const compilerMeta: R3InjectableMetadataFacade = {
    name: type.name,
    type,
    typeArgumentCount: 0,
    providedIn: meta.providedIn,
    userDeps: undefined,
  };
  if ((isUseClassProvider(meta) || isUseFactoryProvider(meta)) && meta.deps !== undefined) {
    compilerMeta.userDeps = convertDependencies(meta.deps);
  }
  if (isUseClassProvider(meta)) {
    // The user explicitly specified useClass, and may or may not have provided deps.
    compilerMeta.useClass = resolveForwardRef(meta.useClass);
  } else if (isUseValueProvider(meta)) {
    // The user explicitly specified useValue.
    compilerMeta.useValue = resolveForwardRef(meta.useValue);
  } else if (isUseFactoryProvider(meta)) {
    // The user explicitly specified useFactory.
    compilerMeta.useFactory = meta.useFactory;
  } else if (isUseExistingProvider(meta)) {
    // The user explicitly specified useExisting.
    compilerMeta.useExisting = resolveForwardRef(meta.useExisting);
  }
  return compilerMeta;
}
