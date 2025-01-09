import { useNuxt } from '@nuxt/kit'
import type { PostgrestError, PostgrestFilterBuilder, PostgrestTransformBuilder, UnstableGetResult } from '@supabase/postgrest-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { GenericSchema, GenericTable, GenericView } from '@supabase/supabase-js/dist/module/lib/types'
import type { AsyncDataRequestStatus } from 'nuxt/app'
import { reactive, toRefs, watchEffect, type ToRefs } from 'vue'

type _StrippedPostgrestFilterBuilder<Schema extends GenericSchema, Row extends Record<string, unknown>, Result, RelationName, Relationships > = Omit<PostgrestFilterBuilder< Schema, Row, Result, RelationName, Relationships>, Exclude<keyof PostgrestTransformBuilder<Schema, Row, Result, RelationName, Relationships>, 'order' | 'range' | 'limit'>>

type StrippedPostgrestFilterBuilder<Schema extends GenericSchema, Row extends Record<string, unknown>, Result, RelationName, Relationships > = {
  [K in keyof _StrippedPostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>]: PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>[K]
}

interface useSupabaseQueryReturnData<DataT, count extends (number | undefined)> {
  status: null | AsyncDataRequestStatus
  data: null | DataT
  count: count
  error: null | PostgrestError
}

export type useSupabseQueryReturn<DataT, count extends (number | undefined)> = Promise<ToRefs<useSupabaseQueryReturnData<DataT, count>>> & ToRefs<useSupabaseQueryReturnData<DataT, count>>

export function useSupabaseQuery<
  const Database extends Record<string, GenericSchema>,
  const SchemaName extends string & keyof Database = 'public',
  const Schema extends GenericSchema = Database[SchemaName],
  const RelationName extends string & (keyof Schema['Tables'] | keyof Schema['Views']) = string,
  const Relation extends RelationName extends keyof Schema['Tables'] ? Schema['Tables'][RelationName] : RelationName extends keyof Schema['Views'] ? Schema['Views'][RelationName] : GenericTable | GenericView = GenericView,
  const _count extends 'exact' | 'planned' | 'estimated' | undefined = undefined,
  const _single extends boolean = false,
  const Relationships = Relation['Relationships'],
  const Query extends string = '*',
  const ResultOne = UnstableGetResult<Schema, Relation['Row'], RelationName, Relationships, Query>,
>(client: SupabaseClient<Database, SchemaName, Schema>, relation: RelationName, query: Query, filter: (builder: StrippedPostgrestFilterBuilder<Schema, Relation['Row'], ResultOne[], RelationName, Relationships>) => StrippedPostgrestFilterBuilder<Schema, Relation['Row'], ResultOne[], RelationName, Relationships>, { single, count }: useSupabaseQueryOptions<_single, _count> = {})/* : useSupabseQueryReturn<(_single extends true ? ResultOne : ResultOne[]), _count extends undefined ? undefined : number> */ {
  const nuxtApp = useNuxt()

  const asyncData = reactive<useSupabaseQueryReturnData<(_single extends true ? ResultOne : ResultOne[]), _count extends 'exact' | 'planned' | 'estimated' ? number : undefined>>({ status: 'idle', data: null, error: null, count: undefined })
  const returning = toRefs(asyncData)

  function makeRequest() {
    const request = client.from(relation).select(query, { count })
    const filteredRequest = filter(request as unknown as StrippedPostgrestFilterBuilder<Schema, Relation['Row'], ResultOne[], RelationName, Relationships>) as unknown as PostgrestTransformBuilder<Schema, Relation['Row'], ResultOne[], RelationName, Relationships>
    if (single) filteredRequest.single()
    return filteredRequest
  }

  const req = makeRequest()
  const key = req.url.pathname + req.url.search

  if (import.meta.browser) {
    let reqInProgress: ReturnType<typeof handleRequest>
    watchEffect(async () => {
      if (reqInProgress) await reqInProgress
      reqInProgress = handleRequest(makeRequest())
    })
  }

  async function handleRequest(request: ReturnType<typeof makeRequest>) {
    asyncData.status = 'pending'
    const { data, error, count } = nuxtApp.payload.data[req.url.pathname + req.url.search] || await request
    Object.assign(asyncData, { data, error, count })
    asyncData.status = error ? 'error' : 'success'
    return returning
  }

  const promise = new Promise<typeof returning>(resolve => handleRequest(req).then(resolve))

  if (import.meta.server) {
    promise.finally(() => nuxtApp.payload.data[key] ??= returning)
    nuxtApp.hook('app:created', async () => { await promise })
  }

  return Object.assign(promise, returning) // as useSupabseQueryReturn<(_single extends true ? ResultOne : ResultOne), _count extends undefined ? undefined : number>
}

export interface useSupabaseQueryOptions<_single extends boolean = false, _count extends 'exact' | 'planned' | 'estimated' | undefined = undefined> {
  // immediate?: AsyncDataOptions<unknown>['immediate']
  // deep?: AsyncDataOptions<unknown>['deep']
  // lazy?: AsyncDataOptions<unknown>['lazy']
  // server?: AsyncDataOptions<unknown>['server']
  // watch?: AsyncDataOptions<unknown>['watch']
  single?: _single
  // limit?: number
  count?: _count
  // range?: [number, number]
}
