import { maskAreEqual, maskIncludes, maskIntersection, maskNew, maskNext, maskUnion }
from './mask';
import type { Mask }                    from './mask';
import { MaskSet }                      from './mask-index';
import type util                        from 'util';
import type { InspectOptionsStylized }  from 'util';

declare module 'util'
{
    function inspect(obj: any, options?: InspectOptions): string;
}

export type AttributeMap = { readonly [AttributeName in string]: string | null; };

export interface Feature
{
    readonly canonicalNames:                                    string[];
    readonly elementary:                                        boolean;
    readonly elementaryNames:                                   string[];
    readonly mask:                                              Mask;
    name?:                                                      string;
    includes(...features: FeatureElementOrCompatibleArray[]):   boolean;
    toString():                                                 string;
}

export interface FeatureConstructor
{
    (...features: FeatureElementOrCompatibleArray[]):           Feature;
    readonly ALL:
    { readonly [FeatureName in string]: PredefinedFeature; };
    readonly ELEMENTARY:                                        readonly PredefinedFeature[];
    new (...features: FeatureElementOrCompatibleArray[]):       Feature;
    areCompatible(...features: FeatureElement[]):               boolean;
    /** @deprecated */
    areCompatible(features: readonly FeatureElement[]):         boolean;
    areEqual(...features: FeatureElementOrCompatibleArray[]):   boolean;
    commonOf(...features: FeatureElementOrCompatibleArray[]):   Feature | null;
    descriptionFor(name: string):                               string | undefined;
}

export type FeatureElement = Feature | string;

export type FeatureElementOrCompatibleArray = FeatureElement | readonly FeatureElement[];

export type FeatureInfo =
(
    {
        readonly aliasFor:      string;
    } |
    {
        readonly attributes?:   { readonly [AttributeName in string]: string | null | undefined; };
        readonly check?:        () => unknown;
        readonly excludes?:     readonly string[];
        readonly includes?:     readonly string[] | IncludeDifferenceMap;
        readonly inherits?:     string;
    }
) &
({ readonly description?: string; } | { readonly engine?: string; });

export type IncludeDifferenceMap = { readonly [FeatureName in string]: boolean; };

export interface PredefinedFeature extends Feature
{
    readonly attributes:    AttributeMap;
    readonly check:         (() => boolean) | undefined;
    readonly engine:        string | undefined;
    readonly name:          string;
}

const _Array_isArray            = Array.isArray as (value: unknown) => value is readonly unknown[];
const _Error                    = Error;
const _JSON_stringify           = JSON.stringify;
const
{
    create:                     _Object_create,
    defineProperty:             _Object_defineProperty,
    freeze:                     _Object_freeze,
    getOwnPropertyDescriptor:   _Object_getOwnPropertyDescriptor,
    keys:                       _Object_keys,
} =
Object;
const _String                   = String;
const _TypeError                = TypeError;

function assignNoEnum(target: object, source: object): void
{
    const names = _Object_keys(source);
    for (const name of names)
    {
        const descriptor = _Object_getOwnPropertyDescriptor(source, name)!;
        descriptor.enumerable = false;
        _Object_defineProperty(target, name, descriptor);
    }
}

function createEngineFeatureDescription(engine: string): string
{
    const description = `Features available in ${engine}.`;
    return description;
}

export function createFeatureClass
(featureInfos: { readonly [FeatureName in string]: FeatureInfo; }): FeatureConstructor
{
    const ALL                               = createMap<PredefinedFeature>();
    const DESCRIPTION_MAP                   = createMap<string | undefined>();
    const ELEMENTARY: PredefinedFeature[]   = [];
    const FEATURE_PROTOTYPE                 = Feature.prototype as object;
    const INCOMPATIBLE_MASK_LIST: Mask[]    = [];
    let PRISTINE_ELEMENTARY: PredefinedFeature[];

    function Feature(this: Feature, ...features: FeatureElementOrCompatibleArray[]): Feature
    {
        const mask = validMaskFromArguments(features);
        const featureObj =
        this instanceof Feature ? this : _Object_create(FEATURE_PROTOTYPE) as Feature;
        initMask(featureObj, mask);
        return featureObj;
    }

    function _getValidFeatureMask(feature?: FeatureElementOrCompatibleArray): Mask
    {
        const mask =
        feature !== undefined ? validMaskFromArrayOrStringOrFeature(feature) : maskNew();
        return mask;
    }

    function areCompatible(): boolean
    {
        let arg0: FeatureElement | readonly FeatureElement[];
        const features: ArrayLike<FeatureElement> =
        arguments.length === 1 &&
        _Array_isArray(arg0 = arguments[0] as FeatureElement | readonly FeatureElement[]) ?
        arg0 : arguments as ArrayLike<FeatureElement>;
        const mask = featureArrayLikeToMask(features);
        const compatible = isMaskCompatible(mask);
        return compatible;
    }

    function areEqual(...features: FeatureElementOrCompatibleArray[]): boolean
    {
        let mask: Mask;
        const equal =
        features.every
        (
            (feature, index): boolean =>
            {
                let returnValue: boolean;
                const otherMask = validMaskFromArrayOrStringOrFeature(feature);
                if (index)
                    returnValue = maskAreEqual(otherMask, mask);
                else
                {
                    mask = otherMask;
                    returnValue = true;
                }
                return returnValue;
            },
        );
        return equal;
    }

    function commonOf(...features: FeatureElementOrCompatibleArray[]): Feature | null
    {
        let featureObj: Feature | null;
        if (features.length)
        {
            let mask: Mask | undefined;
            for (const feature of features)
            {
                const otherMask = validMaskFromArrayOrStringOrFeature(feature);
                if (mask != null)
                    mask = maskIntersection(mask, otherMask);
                else
                    mask = otherMask;
            }
            featureObj = featureFromMask(mask!);
        }
        else
            featureObj = null;
        return featureObj;
    }

    function createFeature
    (
        name: string,
        mask: Mask,
        check: (() => boolean) | undefined,
        engine: string | undefined,
        attributes: AttributeMap,
        elementary?: unknown,
    ): PredefinedFeature
    {
        _Object_freeze(attributes);
        const descriptors: PropertyDescriptorMap =
        {
            attributes:     { value: attributes },
            check:          { value: check },
            engine:         { value: engine },
            name:           { value: name },
        };
        if (elementary)
            descriptors.elementary = { value: true };
        const featureObj = _Object_create(FEATURE_PROTOTYPE, descriptors) as PredefinedFeature;
        initMask(featureObj, mask);
        return featureObj;
    }

    function descriptionFor(name: string): string | undefined
    {
        name = esToString(name);
        if (!(name in DESCRIPTION_MAP))
            throwUnknownFeatureError(name);
        const description = DESCRIPTION_MAP[name];
        return description;
    }

    function featureArrayLikeToMask(features: ArrayLike<FeatureElement>): Mask
    {
        let mask = maskNew();
        const { length } = features;
        for (let index = 0; index < length; ++index)
        {
            const feature = features[index];
            const otherMask = maskFromStringOrFeature(feature);
            mask = maskUnion(mask, otherMask);
        }
        return mask;
    }

    function featureFromMask(mask: Mask): Feature
    {
        const featureObj = _Object_create(FEATURE_PROTOTYPE) as Feature;
        initMask(featureObj, mask);
        return featureObj;
    }

    function fromMask(mask: Mask): Feature | null
    {
        const featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
        return featureObj;
    }

    function isMaskCompatible(mask: Mask): boolean
    {
        const compatible =
        INCOMPATIBLE_MASK_LIST.every
        ((incompatibleMask): boolean => !maskIncludes(mask, incompatibleMask));
        return compatible;
    }

    function maskFromStringOrFeature(feature: FeatureElement): Mask
    {
        let mask: Mask;
        if (feature instanceof Feature)
            ({ mask } = feature as Feature);
        else
        {
            const name = esToString(feature);
            if (!(name in ALL))
                throwUnknownFeatureError(name);
            ({ mask } = ALL[name]);
        }
        return mask;
    }

    function validMaskFromArguments
    (features: readonly FeatureElementOrCompatibleArray[]): Mask
    {
        let mask = maskNew();
        let validationNeeded = false;
        for (const feature of features)
        {
            let otherMask: Mask;
            if (_Array_isArray(feature))
            {
                otherMask = featureArrayLikeToMask(feature);
                validationNeeded ||= feature.length > 1;
            }
            else
                otherMask = maskFromStringOrFeature(feature);
            mask = maskUnion(mask, otherMask);
        }
        validationNeeded ||= features.length > 1;
        if (validationNeeded)
            validateMask(mask);
        return mask;
    }

    function validMaskFromArrayOrStringOrFeature(feature: FeatureElementOrCompatibleArray): Mask
    {
        let mask: Mask;
        if (_Array_isArray(feature))
        {
            mask = featureArrayLikeToMask(feature);
            if (feature.length > 1)
                validateMask(mask);
        }
        else
            mask = maskFromStringOrFeature(feature);
        return mask;
    }

    function validateMask(mask: Mask): void
    {
        if (!isMaskCompatible(mask))
            throw new _Error('Incompatible features');
    }

    assignNoEnum
    (
        FEATURE_PROTOTYPE,
        {
            get canonicalNames(): string[]
            {
                const { mask } = this as Feature;
                const names: string[] = [];
                let includedMask = maskNew();
                for (let index = PRISTINE_ELEMENTARY.length; index--;)
                {
                    const featureObj = PRISTINE_ELEMENTARY[index];
                    const featureMask = featureObj.mask;
                    if (maskIncludes(mask, featureMask) && !maskIncludes(includedMask, featureMask))
                    {
                        includedMask = maskUnion(includedMask, featureMask);
                        names.push(featureObj.name);
                    }
                }
                names.sort();
                return names;
            },

            elementary: false,

            get elementaryNames(): string[]
            {
                const names: string[] = [];
                const { mask } = this as Feature;
                for (const featureObj of ELEMENTARY)
                {
                    const included = maskIncludes(mask, featureObj.mask);
                    if (included)
                        names.push(featureObj.name);
                }
                return names;
            },

            includes(this: Feature, ...features: FeatureElementOrCompatibleArray[]): boolean
            {
                const { mask } = this;
                const included =
                features.every
                (
                    (feature): boolean =>
                    {
                        const otherMask = validMaskFromArrayOrStringOrFeature(feature);
                        const returnValue = maskIncludes(mask, otherMask);
                        return returnValue;
                    },
                );
                return included;
            },

            inspect,

            name: undefined,

            toString(this: Feature): string
            {
                const name = this.name ?? `<${this.canonicalNames.join(', ')}>`;
                const str = `[Feature ${name}]`;
                return str;
            },
        },
    );

    ((): void =>
    {
        function completeExclusions(): void
        {
            const incompatibleMaskSet = new MaskSet();
            for (const name of featureNames)
            {
                const { excludes } =
                featureInfos[name] as { readonly excludes?: readonly string[]; };
                if (excludes)
                {
                    const { mask } = ALL[name]!;
                    for (const exclude of excludes)
                    {
                        const excludeMask = completeFeature(exclude);
                        const incompatibleMask = maskUnion(mask, excludeMask);
                        if (!incompatibleMaskSet.has(incompatibleMask))
                        {
                            INCOMPATIBLE_MASK_LIST.push(incompatibleMask);
                            incompatibleMaskSet.add(incompatibleMask);
                        }
                    }
                }
            }
        }

        function completeFeature(name: string): Mask
        {
            let mask: Mask;
            if (name in ALL)
                ({ mask } = ALL[name]);
            else
            {
                let featureObj: PredefinedFeature;
                let description: string | undefined;
                const info = featureInfos[name];
                const { engine } = info as { readonly engine?: string; };
                if (engine == null)
                    ({ description } = info as { readonly description?: string; });
                else
                    description = createEngineFeatureDescription(engine);
                if ('aliasFor' in info)
                {
                    const { aliasFor } = info;
                    mask = completeFeature(aliasFor);
                    featureObj = ALL[aliasFor]!;
                    if (description == null)
                        description = DESCRIPTION_MAP[aliasFor]!;
                }
                else
                {
                    const { inherits } = info;
                    if (inherits != null)
                        completeFeature(inherits);
                    let wrappedCheck: (() => boolean) | undefined;
                    const { check } = info;
                    if (check)
                    {
                        mask = maskNext(unionMask);
                        unionMask = maskUnion(unionMask, mask);
                        wrappedCheck = wrapCheck(check);
                    }
                    else
                        mask = maskNew();
                    {
                        const { includes } = info;
                        const includeSet = includeSetMap[name] = createMap<null>();
                        if (_Array_isArray(includes))
                        {
                            for (const include of includes)
                                includeSet[include] = null;
                        }
                        else
                        {
                            const inheritedIncludeSet = includeSetMap[inherits!];
                            for (const include in inheritedIncludeSet)
                                includeSet[include] = null;
                            if (includes)
                            {
                                const includeDiffNames = _Object_keys(includes);
                                for (const include of includeDiffNames)
                                {
                                    if (includes[include])
                                        includeSet[include] = null;
                                    else
                                        delete includeSet[include];
                                }
                            }
                        }
                        for (const include in includeSet)
                        {
                            const includeMask = completeFeature(include);
                            mask = maskUnion(mask, includeMask);
                        }
                    }
                    const attributes = createMap<string | null>();
                    if (inherits != null)
                    {
                        const inheritedAttributes = ALL[inherits].attributes;
                        for (const attributeName in inheritedAttributes)
                            attributes[attributeName] = inheritedAttributes[attributeName];
                    }
                    {
                        const infoAttributes = info.attributes;
                        if (infoAttributes)
                        {
                            const attributeNames = _Object_keys(infoAttributes);
                            for (const attributeName of attributeNames)
                            {
                                const attributeValue = infoAttributes[attributeName];
                                if (attributeValue !== undefined)
                                {
                                    attributes[attributeName] =
                                    typeof attributeValue === 'string' ? attributeValue : null;
                                }
                                else
                                    delete attributes[attributeName];
                            }
                        }
                    }
                    const elementary = wrappedCheck ?? info.excludes;
                    featureObj =
                    createFeature(name, mask, wrappedCheck, engine, attributes, elementary);
                    if (elementary)
                        ELEMENTARY.push(featureObj);
                }
                ALL[name] = featureObj;
                DESCRIPTION_MAP[name] = description;
            }
            return mask;
        }

        {
            const constructorSource =
            {
                ALL,
                ELEMENTARY,
                _getValidFeatureMask,
                areCompatible,
                areEqual,
                commonOf,
                descriptionFor,
                fromMask,
            };
            assignNoEnum(Feature, constructorSource);
        }
        {
            let inspectKey: symbol | undefined;
            try
            {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                inspectKey = (require('util') as typeof util).inspect.custom;
            }
            catch
            { }
            if (inspectKey)
            {
                _Object_defineProperty
                (
                    FEATURE_PROTOTYPE,
                    inspectKey,
                    { configurable: true, value: inspect, writable: true },
                );
            }
        }

        const featureNames = _Object_keys(featureInfos);
        const includeSetMap = createMap<{ readonly [FeatureName in string]: null; }>();
        let unionMask = maskNew();

        featureNames.forEach(completeFeature);
        completeExclusions();
        PRISTINE_ELEMENTARY = ELEMENTARY.slice();
        ELEMENTARY.sort((feature1, feature2): number => feature1.name < feature2.name ? -1 : 1);
        _Object_freeze(ELEMENTARY);
        _Object_freeze(ALL);
    }
    )();

    return Feature as FeatureConstructor;
}

const createMap = <T>(): { [Key in string]: T; } => _Object_create(null) as { };

function esToString(name: unknown): string
{
    if (typeof name === 'symbol')
        throw new _TypeError('Cannot convert a symbol to a string');
    const str = _String(name);
    return str;
}

export function featuresToMask(featureObjs: readonly Feature[]): Mask
{
    const mask =
    featureObjs.reduce((mask, featureObj): Mask => maskUnion(mask, featureObj.mask), maskNew());
    return mask;
}

function indent(text: string): string
{
    const returnValue = text.replace(/^/gm, '  ');
    return returnValue;
}

function initMask(featureObj: Feature, mask: Mask): void
{
    _Object_defineProperty(featureObj, 'mask', { value: mask });
}

/**
 * Node.js custom inspection function.
 * Set on `Feature.prototype` with name `"inspect"` for Node.js ≤ 8.6.x and with symbol
 * `Symbol.for("nodejs.util.inspect.custom")` for Node.js ≥ 6.6.x.
 *
 * @see
 * {@link https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects} for further
 * information.
 */
// opts can be undefined in Node.js 0.10.0.
function inspect(this: Feature, depth: never, opts?: InspectOptionsStylized): string
{
    const breakLength = opts?.breakLength ?? 80;
    const compact = opts?.compact ?? true;
    let { name } = this;
    if (name === undefined)
        name = joinParts(compact, '<', '', this.canonicalNames, ',', '>', breakLength - 3);
    const parts = [name];
    if (this.elementary)
        parts.push('(elementary)');
    if ((this as PredefinedFeature).check !== undefined)
        parts.push('(check)');
    {
        const container: { [Key in string]: unknown; } = { };
        const { attributes, engine } = this as PredefinedFeature;
        if (engine !== undefined)
            container.engine = engine;
        if (attributes as AttributeMap | undefined !== undefined)
            container.attributes = { ...attributes };
        if (_Object_keys(container).length)
        {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { inspect } = require('util') as typeof util;
            const str = inspect(container, opts);
            parts.push(str);
        }
    }
    const str = joinParts(compact, '[Feature', ' ', parts, '', ']', breakLength - 1);
    return str;
}

function joinParts
(
    compact: boolean | number,
    intro: string,
    preSeparator: string,
    parts: readonly string[],
    partSeparator: string,
    outro: string,
    maxLength: number,
):
string
{
    function isMultiline(): boolean
    {
        let length =
        intro.length +
        preSeparator.length +
        (parts.length - 1) * (partSeparator.length + 1) +
        outro.length;
        for (const part of parts)
        {
            if (~part.indexOf('\n'))
                return true;
            length += part.replace(/\x1b\[\d+m/g, '').length;
            if (length > maxLength)
                return true;
        }
        return false;
    }

    const str =
    parts.length && (!compact || isMultiline()) ?
    `${intro}\n${indent(parts.join(`${partSeparator}\n`))}\n${outro}` :
    `${intro}${preSeparator}${parts.join(`${partSeparator} `)}${outro}`;
    return str;
}

function throwUnknownFeatureError(name: string): never
{
    throw new _Error(`Unknown feature ${_JSON_stringify(name)}`);
}

function wrapCheck(check: () => unknown): () => boolean
{
    const wrappedCheck = (): boolean => !!check();
    return wrappedCheck;
}
