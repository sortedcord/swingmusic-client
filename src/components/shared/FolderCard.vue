<template>
  <RouterLink
    :to="{
      name: Routes.folder,
      params: {
        path: folder.path,
      },
    }"
    class="foldercard rounded"
  >
    <div class="rimg rounded-sm">
      <svg
        width="30"
        height="30"
        fill="currentColor"
        viewBox="0 0 28 28"
        xmlns="http://www.w3.org/2000/svg"
        class="bg"
      >
        <path
          d="M7 5.6875C5.55231 5.6875 4.375 6.86481 4.375 8.3125V19.6875C4.375 21.1352 5.55231 22.3125 7 22.3125H21C22.4477 22.3125 23.625 21.1352 23.625 19.6875V10.0625C23.625 8.61481 22.4477 7.4375 21 7.4375H12.7328C12.3369 7.4375 11.9492 7.30146 11.6407 7.05383L10.8914 6.45483C10.2732 5.96046 9.49659 5.6875 8.70471 5.6875H7ZM7 7.4375H8.70471C9.10065 7.4375 9.48873 7.57354 9.79761 7.82117L10.5461 8.42017C11.1643 8.91454 11.9409 9.1875 12.7328 9.1875H21C21.4826 9.1875 21.875 9.57994 21.875 10.0625V10.5H6.125V8.3125C6.125 7.82994 6.51744 7.4375 7 7.4375ZM6.125 12.25H21.875V19.6875C21.875 20.1701 21.4826 20.5625 21 20.5625H7C6.51744 20.5625 6.125 20.1701 6.125 19.6875V12.25ZM15.8705 13.3634L13.8214 13.7787C13.6705 13.8093 13.5625 13.9347 13.5625 14.0795V17.1086C13.5625 17.2556 13.4371 17.3717 13.025 17.4513C12.3867 17.5751 11.8125 17.8221 11.8125 18.5903C11.8125 18.9701 12.1575 19.4551 13.025 19.4551C13.7806 19.4551 14.4375 18.8381 14.4375 17.9631V15.6073C14.4375 15.5106 14.509 15.4271 14.6101 15.4065L15.9286 15.1382C16.0795 15.1076 16.1875 14.9822 16.1875 14.8374V13.6035C16.1875 13.4469 16.0337 13.3302 15.8705 13.3634Z"
          fill="currentColor"
        />
      </svg>
      <PlayBtn :source="playSources.folder" :folderpath="folder.path" />
    </div>

    <div v-if="folder.help_text" class="rhelp folder">
      {{ folder.help_text }}
    </div>
    <div class="ellip" :title="name(folder.path)">
      {{ name(folder.path) }}
    </div>
    <div class="rtcount">
      <b>{{ folder.count }} Track{{ folder.count == 1 ? "" : "s" }}</b>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import PlayBtn from "../shared/PlayBtn.vue";
import { playSources } from "@/enums";

defineProps<{
  folder: {
    path: string;
    count: number;
    help_text: string;
  };
}>();

const name = (path: string) => {
  const splits = path.split("/");

  return splits[splits.length - 1];
};
</script>

<style lang="scss">
.foldercard {
  padding: $medium;
  display: flex;
  flex-direction: column;
  height: max-content;

  .play-btn {
    position: absolute;
    width: 4rem;
    bottom: 0;
    opacity: 0;
    transition: all 0.25s;
  }

  &:hover {
    background-color: $gray4;

    .play-btn {
      opacity: 1;
      transform: translateY(-1rem);
    }
  }

  svg.bg {
    transform: scale(2);
    color: $gray2;
  }

  .rimg {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background-color: $gray;
    background-image: linear-gradient(37deg, $gray5, $gray, $gray);
    margin-bottom: $small;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rtcount {
    font-size: 12px;
    color: #ffffffbf;
    margin-top: $smaller;
  }
}
</style>
