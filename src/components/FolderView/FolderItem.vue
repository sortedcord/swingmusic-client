<template>
  <router-link :to="{ name: Routes.folder, params: { path: folder.path } }">
    <div
      v-auto-animate
      class="f-item"
      :style="{
        backgroundColor: is_checked ? '#234ece' : '',
      }"
      :class="{ context_menu_showing }"
      @click="(e) => (folder_page ? null : handleClick(e))"
      @mouseover="mouse_over = true"
      @mouseleave="mouse_over = false"
      @contextmenu.prevent="(e) => (!folder_page ? null : showContextMenu(e))"
    >
      <SymLinkSvg v-if="folder.is_sym" />
      <FolderSvg v-else />
      <div class="info">
        <div class="f-item-text ellip">{{ folder.name }}</div>
        <div v-if="folder.count" class="f-count">
          {{ folder.count + ` File${folder.count == 1 ? "" : "s"}` }}
        </div>
      </div>
      <div v-if="!folder_page" class="check">
        <CheckSvg v-if="!is_checked && mouse_over" />
        <CheckFilledSvg v-if="is_checked" />
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { ref } from "vue";

import { Folder } from "@/interfaces";

import FolderSvg from "@/assets/icons/folder.svg";
import SymLinkSvg from "@/assets/icons/symlink.svg";

import CheckFilledSvg from "@/assets/icons/check.filled.svg";
import CheckSvg from "@/assets/icons/square.svg";
import { showFolderContextMenu } from "@/helpers/contextMenuHandler";
import { ContextSrc } from "@/enums";

const props = defineProps<{
  folder: Folder;
  is_checked?: boolean;
  folder_page?: boolean;
}>();

const emit = defineEmits<{
  (e: "navigate"): void;
  (e: "check"): void;
}>();

const mouse_over = ref(false);
const context_menu_showing = ref(false);

function handleClick(e: MouseEvent) {
  e.preventDefault();
  // check if the click was on the checkbox
  if (e.target instanceof Element && e.target.closest(".check")) {
    emit("check");
    return;
  }

  if (!props.is_checked) {
    emit("navigate");
  }
}

function showContextMenu(e: MouseEvent) {
  showFolderContextMenu(
    e,
    context_menu_showing,
    ContextSrc.FolderCard,
    props.folder.path
  );
}
</script>

<style lang="scss">
.f-item {
  height: 5rem;
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  background-color: $gray;
  border-radius: $medium;
  position: relative;
  padding: 0 0 0 1rem;
  gap: $small;

  &.context_menu_showing {
    background-color: $gray4;
  }

  svg {
    color: $gray1;
  }

  .f-count {
    font-size: $medium;
    font-weight: 700;
    color: $gray1;
    white-space: nowrap;
  }

  .check {
    z-index: 10;
    position: absolute;
    top: $smaller;
    right: $smaller;

    border: none;
    outline: none;
    color: $darkblue;
    transform: scale(0.75);
  }

  @include largePhones {
    height: 4rem;
  }

  .f-item-text {
    margin-right: 1rem;
  }

  &:hover {
    .options {
      display: block;
    }
  }
}
</style>
