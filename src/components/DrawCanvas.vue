<style lang="scss">
canvas {
  border: 0;
  border-radius: 0px 0px 5px 5px;
  background: #fff;
  display: block;
  margin: 0 auto;
}
</style>

<template>
  <canvas :width="width" :height="height" ref="canvas" @touchstart="startDrawing" @mousedown="startDrawing" @touchmove="draw" @mousemove="draw" @touchend="endDrawing" @mouseup="endDrawing" />
</template>

<script>
export default {
  props: {
    width: Number,
    height: Number,
    disabled: Boolean,
    onLineEnd: Function,
    paths: Array,
    updatePaths: Function
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      isDrawing: false,
      lastX: null,
      lastY: null
    };
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.strokeStyle = "#000";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 5;
  },
  methods: {
    startDrawing() {
      if (this.disabled) {
        return;
      }
      this.isDrawing = true;
      this.lastX = null;
      this.lastY = null;
      this.stopBodyScrolling(true);
    },
    draw(e) {
      if (this.disabled) {
        return;
      }
      if (this.isDrawing) {
        const isTouch = e.type === "touchmove" ? true : false;
        const pageX = isTouch ? e.touches[0].pageX : e.pageX;
        const pageY = isTouch ? e.touches[0].pageY : e.pageY;
        const x = pageX - this.canvas.offsetLeft;
        const y = pageY - this.canvas.offsetTop;

        let { lastX, lastY } = this;
        lastX = lastX ? lastX : x;
        lastY = lastY ? lastY : y;

        this.updatePaths(lastX, lastY, x, y);

        this.lastX = x;
        this.lastY = y;
      }
    },
    endDrawing() {
      if (this.disabled) {
        return;
      }
      this.isDrawing = false;
      this.lastX = null;
      this.lastY = null;
      this.stopBodyScrolling(false);
      this.onLineEnd();
    },
    stopBodyScrolling(bool) {
      const freezeVp = function(e) {
        e.preventDefault();
      };
      if (bool) {
        document.body.addEventListener("touchmove", freezeVp, false);
      } else {
        document.body.removeEventListener("touchmove", freezeVp, false);
      }
    }
  },
  watch: {
    paths(val) {
      const { ctx, canvas } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      val.forEach((path, index) => {
        if (index % 4 === 0 && index != 0) {
          ctx.beginPath();
          ctx.moveTo(val[index - 4][".value"], val[index - 3][".value"]);
          ctx.lineTo(val[index - 2][".value"], val[index - 1][".value"]);
          ctx.closePath();
          ctx.stroke();
        }
      });
    }
  }
};
</script>
