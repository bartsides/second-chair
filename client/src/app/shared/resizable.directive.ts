import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appResizable]',
  standalone: true,
})
export class ResizableDirective implements OnInit {
  @Input() resizableGrabHeight = 8;
  @Input() resizableMinHeight = 10;

  dragging = false;

  constructor(private el: ElementRef) {
    function preventGlobalMouseEvents() {
      document.body.style.pointerEvents = 'none';
    }

    function restoreGlobalMouseEvents() {
      document.body.style.pointerEvents = 'auto';
    }

    const newHeight = (height: number) => {
      const newHeight = Math.max(this.resizableMinHeight, height);
      el.nativeElement.style.height = newHeight + 'px';
    };

    const mouseMoveG = (evt: MouseEvent) => {
      if (!this.dragging) {
        return;
      }
      newHeight(evt.clientY - el.nativeElement.offsetTop);
      evt.stopPropagation();
    };

    const mouseUpG = (evt: MouseEvent) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
    };

    const mouseDown = (evt: MouseEvent) => {
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };

    const mouseMove = (evt: MouseEvent) => {
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = 'row-resize';
      } else {
        el.nativeElement.style.cursor = 'default';
      }
    };

    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
  }

  ngOnInit(): void {
    // this.el.nativeElement.style['border-bottom'] =
    //   this.resizableGrabHeight + 'px solid darkgrey';
  }

  inDragRegion(evt: MouseEvent) {
    return (
      this.el.nativeElement.clientHeight -
        evt.clientY +
        this.el.nativeElement.offsetTop <
      this.resizableGrabHeight
    );
  }
}
