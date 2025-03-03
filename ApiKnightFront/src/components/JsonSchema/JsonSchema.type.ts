/*
 * @Author: xiaolajiaobc 13456820+xiaolajiaobc@user.noreply.gitee.com
 * @Date: 2024-12-15 12:56:46
 * @LastEditors: xiaolajiaobc 13456820+xiaolajiaobc@user.noreply.gitee.com
 * @LastEditTime: 2024-12-15 15:54:59
 * @FilePath: \ApiKnight\ApiKnightFront\src\components\JsonSchema\JsonSchema.type.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { SchemaType } from './constants'

export interface BaseSchema {
  name?: string
  displayName?: string
  description?: string
}

export interface PrimitiveSchema extends BaseSchema {
  type:
    | SchemaType.Boolean
    | SchemaType.Number
    | SchemaType.Integer
    | SchemaType.String
    | SchemaType.Null
}

export interface ObjectSchema extends BaseSchema {
  type: SchemaType.Object
  properties?: JsonSchema[]
}

export interface ArraySchema extends BaseSchema {
  type: SchemaType.Array
  items: PrimitiveSchema | ObjectSchema | ArraySchema
}

export interface RefSchema extends BaseSchema {
  type: SchemaType.Refer
  $ref: string
}

export type JsonSchema =
  | PrimitiveSchema
  | ObjectSchema
  | ArraySchema
  | RefSchema

export type FieldPath = string

export interface ColumnType {
  key: string
  colClassName?: string
  colStyle?: React.CSSProperties

  render?: (
    text: React.ReactNode,
    record: JsonSchema,
    extraData: {
      disabled?: boolean
      fieldPath: FieldPath[]
    },
  ) => React.ReactNode
}
