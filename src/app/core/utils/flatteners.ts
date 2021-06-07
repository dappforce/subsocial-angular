import {Option} from '@polkadot/types/codec';
import {AccountId} from '@polkadot/types/interfaces/runtime';
import {bool} from '@polkadot/types/primitive';
import {Content, EntityId, Post, Space, SpacePermissionSet, WhoAndWhen} from '@subsocial/types/substrate/interfaces';
import BN from 'bn.js';
import {
  SpacePermissionKey,
  SpacePermissionMap,
  SpacePermissions,
  SpacePermissions as FlatSpacePermissions,
  SpacePermissionsKey
} from './permission-types';
import {CommonContent, SocialAccountWithId} from '@subsocial/types';
import {notEmptyObj} from '@subsocial/utils';

type Id = string

export type Cid = string

export type HasId = {
  id: Id
}

export type CanHaveParentId = {
  parentId?: Id
}

export type CanHaveSpaceId = {
  spaceId?: Id
}

export type CanHaveContent = {
  contentId?: Cid
}

export type HasOwner = {
  ownerId: string
}

export type HasHandle = {
  handle: string
}

export type CanHaveHandle = Partial<HasHandle>

export type HasCreated = {
  createdByAccount: string
  createdAtBlock: number
  createdAtTime: number
}

export type CanBeUpdated = {
  isUpdated?: boolean
  updatedByAccount?: string
  updatedAtBlock?: number
  updatedAtTime?: number
}

export type CanBeHidden = {
  hidden: boolean // TODO rename to 'isHidden'?
  // isPublic: boolean
}

export type FlatSuperCommon =
  HasCreated &
  CanBeUpdated &
  CanHaveContent

type FlatSpaceOrPost =
  FlatSuperCommon &
  HasId &
  HasOwner &
  CanBeHidden

/** Flat space struct. */
export type SpaceStruct = FlatSpaceOrPost & CanHaveParentId & CanHaveHandle & FlatSpacePermissions & {
  postsCount: number
  hiddenPostsCount: number

  // TODO maybe we do not need `visiblePostsCount` field here.
  // It can be easily calculated as (postsCount - hiddenPostsCount)
  visiblePostsCount: number


  canFollowerCreatePosts: boolean
  canEveryoneCreatePosts: boolean

  followersCount: number
  score: number
  // permissions?: SpacePermissions
}

/** Flat post struct. */
export type PostStruct = FlatSpaceOrPost & CanHaveSpaceId & {
  repliesCount: number
  hiddenRepliesCount: number

  // TODO maybe we do not need `visibleRepliesCount` field here.
  // It can be easily calculated as (repliesCount - hiddenRepliesCount)
  visibleRepliesCount: number

  sharesCount: number
  upvotesCount: number
  downvotesCount: number
  score: number

  isRegularPost: boolean
  isSharedPost: boolean
  isComment: boolean
}

type CommentExtension = {
  parentId?: Id
  rootPostId: Id
}

type SharedPostExtension = {
  sharedPostId: Id
}

type FlatPostExtension = {} | CommentExtension | SharedPostExtension

export type SharedPostStruct = PostStruct & SharedPostExtension

export type CommentStruct = PostStruct & CommentExtension

type SocialAccountStruct = HasId & {
  followersCount: number
  followingAccountsCount: number
  followingSpacesCount: number
  reputation: number
  hasProfile: boolean
}

// TODO rename to SocialAccount or AnonProfileStruct?
/** Flat representation of a social account that does not have a profile content. */
export type ProfileStruct = SocialAccountStruct & Partial<FlatSuperCommon>

/** Flat representation of a social account that created a profile content. */
export type PublicProfileStruct = SocialAccountStruct & FlatSuperCommon

type SuperCommonStruct = {
  created: WhoAndWhen
  updated: Option<WhoAndWhen>
  content: Content
}

type SpaceOrPostStruct = SuperCommonStruct & {
  id: BN
  owner: AccountId
  hidden: bool
}


export function flattenPostStructs(structs: Post[]): PostStruct[] {
  return structs.map(flattenPostStruct);
}

export function flattenPostStruct(struct: Post): PostStruct {
  const repliesCount = struct.replies_count.toNumber();
  const hiddenRepliesCount = struct.hidden_replies_count.toNumber();
  const visibleRepliesCount = repliesCount - hiddenRepliesCount;
  const {isRegularPost, isSharedPost, isComment} = struct.extension;
  const extensionFields = flattenPostExtension(struct);

  let spaceField: CanHaveSpaceId = {};
  if (struct.space_id.isSome) {
    spaceField = {
      spaceId: struct.space_id.unwrap().toString(),
    };
  }

  return {
    ...flattenSpaceOrPostStruct(struct),
    ...spaceField,
    ...extensionFields,

    repliesCount,
    hiddenRepliesCount,
    visibleRepliesCount,

    sharesCount: struct.shares_count.toNumber(),
    upvotesCount: struct.upvotes_count.toNumber(),
    downvotesCount: struct.downvotes_count.toNumber(),
    score: struct.score.toNumber(),

    isRegularPost,
    isSharedPost,
    isComment,
  };
}

function flattenPostExtension(struct: Post): FlatPostExtension {
  const {isSharedPost, isComment} = struct.extension;
  let normExt: FlatPostExtension = {};

  if (isSharedPost) {
    const sharedPost: SharedPostExtension = {
      sharedPostId: struct.extension.asSharedPost.toString()
    };
    normExt = sharedPost;
  } else if (isComment) {
    const {parent_id, root_post_id} = struct.extension.asComment;
    const comment: CommentExtension = {
      rootPostId: root_post_id.toString()
    };
    if (parent_id.isSome) {
      comment.parentId = parent_id.unwrap().toString();
    }
    normExt = comment;
  }

  return normExt;
}

export function flattenSpaceStructs(structs: Space[]): SpaceStruct[] {
  return structs.map(flattenSpaceStruct);
}

export function flattenSpaceStruct(struct: Space): SpaceStruct {
  const postsCount = struct.posts_count.toNumber();
  const hiddenPostsCount = struct.hidden_posts_count.toNumber();
  const visiblePostsCount = postsCount - hiddenPostsCount;
  const flatPermissions = flattenPermisions(struct.permissions.unwrapOr(undefined));

  let parentField: CanHaveParentId = {};
  if (struct.parent_id.isSome) {
    parentField = {
      parentId: struct.parent_id.unwrap().toString()
    };
  }

  let handleField: CanHaveHandle = {};
  if (struct.handle.isSome) {
    handleField = {
      handle: struct.handle.unwrap().toString()
    };
  }


  return {
    ...flattenSpaceOrPostStruct(struct),
    ...parentField,
    ...handleField,

    ...flatPermissions,
    canFollowerCreatePosts: !!flatPermissions.followerPermissions?.CreatePosts, //TODO: check CreatePosts permissions in follower set
    canEveryoneCreatePosts: !!flatPermissions.everyonePermissions?.CreatePosts, //TODO: check CreatePosts permissions in everyone set
    postsCount,
    hiddenPostsCount,
    visiblePostsCount,
    followersCount: struct.followers_count.toNumber(),
    score: struct.score.toNumber()
  };
}

function flattenSpaceOrPostStruct(struct: SpaceOrPostStruct): FlatSpaceOrPost {
  return {
    ...flattenCommonFields(struct),
    id: struct.id.toString(),
    ownerId: struct.owner.toString(),
    hidden: struct.hidden.isTrue,
  };
}

function flattenCommonFields(struct: SuperCommonStruct): FlatSuperCommon {
  const {created} = struct;

  return {
    // created:
    createdByAccount: created.account.toString(),
    createdAtBlock: created.block.toNumber(),
    createdAtTime: created.time.toNumber(),

    ...getUpdatedFields(struct),
    ...getContentFields(struct),
  };
}

function getUpdatedFields({updated}: SuperCommonStruct): CanBeUpdated {
  const maybeUpdated = updated.unwrapOr(undefined);
  let res: CanBeUpdated = {
    isUpdated: updated.isSome,
  };
  if (maybeUpdated) {
    res = {
      ...res,
      updatedByAccount: maybeUpdated.account.toString(),
      updatedAtBlock: maybeUpdated.block.toNumber(),
      updatedAtTime: maybeUpdated.time.toNumber(),
    };
  }
  return res;
}

function getContentFields({content}: SuperCommonStruct): CanHaveContent {
  let res: CanHaveContent = {};
  if (content.isIpfs) {
    res = {
      contentId: content.asIpfs.toString()
    };
  }
  return res;
}

export const flattenPermisions = (permissions?: SpacePermissions) => {
  const flatPermissions: FlatSpacePermissions = {};

  if (permissions) {
    // @ts-ignore
    for (const [key, value] of permissions) {
      const permissionSet = (value as Option<SpacePermissionSet>).unwrapOr(undefined);
      const permission: SpacePermissionMap = {};

      permissionSet?.forEach(x => {
        permission[x.toString() as SpacePermissionKey] = true;
      });

      const name = key === 'space_owner' ? 'spaceOwner' : key;

      flatPermissions[`${name}Permissions` as SpacePermissionsKey] = permission;
    }
  }

  return flatPermissions;
};

export type EntityData<S extends HasId, C extends CommonContent> = {
  id: EntityId
  struct: S
  content?: C
}


type EntityDataWithField<S extends {}> = EntityData<HasId & S, CommonContent> | (HasId & S)

export const getUniqueOwnerIds = (entities: EntityDataWithField<HasOwner>[]) =>
  getUniqueIds(entities, 'ownerId');

export const getUniqueContentIds = (entities: EntityDataWithField<CanHaveContent>[]) =>
  getUniqueIds(entities, 'contentId');


export function getUniqueIds<S extends {}>(structs: EntityDataWithField<S>[], idFieldName: keyof S): EntityId[] {
  type _EntityData = EntityData<S & HasId, CommonContent>
  const ids = new Set<EntityId>();
  structs.forEach((x) => {
    const edStruct = (x as _EntityData).struct;
    const struct = notEmptyObj(edStruct) ? edStruct : x as S;
    const id = struct[idFieldName] as unknown as EntityId;
    if (id && !ids.has(id)) {
      ids.add(id);
    }
  });
  return Array.from(ids);
}

export function flattenProfileStructs(accounts: SocialAccountWithId[]): ProfileStruct[] {
  return accounts.map(flattenProfileStruct);
}

export function flattenProfileStruct(struct: SocialAccountWithId): ProfileStruct {
  const profile = struct.profile?.unwrapOr(undefined);
  const hasProfile = struct.profile?.isSome;
  const maybeProfile: Partial<FlatSuperCommon> = profile
    ? flattenCommonFields(profile)
    : {};

  return {
    id: struct.id.toString(),

    followersCount: struct.followers_count.toNumber(),
    followingAccountsCount: struct.following_accounts_count.toNumber(),
    followingSpacesCount: struct.following_spaces_count.toNumber(),
    reputation: struct.reputation.toNumber(),

    hasProfile,
    ...maybeProfile
  };
}
