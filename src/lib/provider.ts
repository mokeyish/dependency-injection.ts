
import { Type } from './interface/type';
import { Provider, StaticProvider } from './interface/provider';
import { invalidProviderError } from './errors';


export function normalizeProviders(
    providers: Provider[], res?: StaticProvider[]): StaticProvider[] {
    res = res || [];
    providers.forEach(b => {
        if (b instanceof Type) {
            res!.push({ provide: b, useClass: b});

        } else if (b && typeof b === 'object' && (b as any).provide !== undefined) {
            res!.push(b);

        } else if (Array.isArray(b)) {
            normalizeProviders(b, res);

        } else {
            throw invalidProviderError(b);
        }
    });
    return res;
}

