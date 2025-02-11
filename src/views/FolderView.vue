<template>
  <div
    class="folder-view v-scroll-page"
    style="height: 100%"
    :class="{ isSmall, isMedium }"
  >
    <NoItems
      :flag="folder.tracks.length === 0 && folder.dirs.length === 0"
      :title="folder.query === '' ? 'Folder is empty' : 'No results found'"
      :description="
        folder.query === ''
          ? 'The folder you are trying to access has no indexed tracks. Please add tracks to this folder and try again'
          : `
      No tracks or folders in this immediate directory matched the query: '${folder.query}'`
      "
      :icon="FolderSvg"
    />
    <DynamicScroller
      :items="scrollerItems"
      :min-item-size="64"
      class="scroller"
      style="height: 100%"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.props]"
          :data-index="index"
        >
          <component
            :is="item.component"
            :key="index"
            v-bind="item.props"
            @playThis="playFromPage(item.props.index - 1)"
          ></component>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

import useQueue from "@/stores/queue";
import useLoader from "@/stores/loader";
import useFolder from "@/stores/pages/folder";
import useTracklist from "@/stores/queue/tracklist";
import { isMedium, isSmall } from "@/stores/content-width";

import { Track } from "@/interfaces";
import { dropSources } from "@/enums";
import { createTrackProps } from "@/utils";
import updatePageTitle from "@/utils/updatePageTitle";

import FolderSvg from "@/assets/icons/folder.svg";
import NoItems from "@/components/shared/NoItems.vue";
import SongItem from "@/components/shared/SongItem.vue";
import FolderList from "@/components/FolderView/FolderList.vue";

const queue = useQueue();
const loader = useLoader();
const folder = useFolder();
const tracklist = useTracklist();

interface ScrollerItem {
  id: string | undefined;
  component: typeof FolderList | typeof SongItem;
  props: any;
}

class songItem {
  id: string | undefined;
  props: any;
  component = SongItem;

  constructor(track: Track) {
    this.id = track.filepath;
    this.props = { ...createTrackProps(track), source: dropSources.folder };
  }
}

const scrollerItems = computed(() => {
  const items: ScrollerItem[] = [];

  if (folder.dirs.length) {
    items.push({
      id: "folder-list",
      component: FolderList,
      props: {
        folders: folder.dirs,
      },
    });
  }

  folder.tracks.forEach((track) => {
    items.push(new songItem(track));
  });

  return items;
});

function playFromPage(index: number) {
  tracklist.setFromFolder(folder.path, folder.allTracks);
  queue.play(index);
}

onBeforeRouteUpdate((to, from) => {
  loader.startLoading();
  folder
    .fetchAll(to.params.path as string)

    .then(() => {
      folder.resetQuery();
    })
    .then(() => {
      loader.stopLoading();
    });
});

onBeforeRouteLeave(() => {
  folder.resetAll();
});

onMounted(() => updatePageTitle("Folders"));
</script>
