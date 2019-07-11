import Model, {
    AnyModel,
    FieldSpecKeys,
    IdType,
    InferModelOpts,
    ModelOpts,
    Ref,
    Serializable
} from '../Model';
import { Field, ForeignKey, OneToOne } from '../fields';

/**
 * {@link TableOpts} used for {@link Table} customization.
 *
 * Supplied via {@link Model#options}.
 *
 * If no customizations were provided, the table uses following default options:
 * <br/>
 * ```typescript
 *  {
 *      idAttribute: 'id',
 *      arrName:     'items',
 *      mapName:     'itemsById'
 *  }
 * ```
 * <br/>
 *  @see {@link Model}
 *  @see {@link Model#options}
 *  @see {@link OrmState}
 */
export interface TableOpts extends ModelOpts {
    readonly fields?: Record<string, Serializable>;
}

/**
 * Handles the underlying data structure for a {@link Model} class.
 */
export class Table<M extends Model> {
    /**
     * Creates a new {@link Table} instance.
     *
     * @param   userOpts - options to use.
     * @param   [userOpts.idAttribute=DefaultTableOpts.idAttribute] - the id attribute of the entity.
     * @param   [userOpts.arrName=DefaultTableOpts.arrName] - the state attribute where an array of
     *                                             entity id's are stored
     * @param   [userOpts.mapName=DefaultTableOpts.mapName] - the state attribute where the entity objects
     *                                                 are stored in a id to entity object
     *                                                 map.
     * @param   [userOpts.fields=DefaultTableOpts.fields] - mapping of field key to {@link Field} object
     */
    constructor(userOpts?: InferModelOpts<M>);

    getEmptyState(): TableState<M>;
}

/**
 * Type of {@link Model} state's branch `meta` field.
 */
export interface DefaultMeta<MIdType> {
    maxId: MIdType extends number ? number : null | number;
}

export type TableIndexes<M extends AnyModel> = {
    [K in FieldSpecKeys<M, OneToOne | ForeignKey>]: string;
};

/**
 * A mapped type parametrized by specific {@link Model} class.
 *
 * Infers actual state of the ORM branch based on the {@link Model} class provided.
 */
export type TableState<M extends Model> = {
    readonly meta: DefaultMeta<IdType<M>>;
    readonly indexes: TableIndexes<M>;
} & Record<InferModelOpts<M>['arrName'], ReadonlyArray<IdType<M>>> &
    Record<InferModelOpts<M>['mapName'], Record<string, Ref<M>>>;
