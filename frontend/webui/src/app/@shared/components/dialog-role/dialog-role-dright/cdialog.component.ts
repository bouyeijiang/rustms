import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormLayout, OperableTreeComponent, ToastService } from 'ng-devui';
import { SysDeptService } from 'src/app/@core/services/sysdept.service';
import { SysRoleService } from 'src/app/@core/services/sysrole.service';

@Component({
    selector: 'dialog-role-dright',
    templateUrl: './cdialog.component.html',
    styleUrls: ['./cdialog.component.scss']
})
export class DialogRoleDRightComponent implements OnInit{
    @Input() data: any;
    @Input() handler: Function;
    layoutDirection: FormLayout = FormLayout.Vertical;
    iconParentOpen = '<span class="icon icon-chevron-down"></span>';
    iconParentClose = '<span class="icon icon-collapse"></span>';
    
    @ViewChild('operableTree', { static: true }) operableTree: OperableTreeComponent;
    dataSource =  [{
       "id": "20404794-657e-433a-a635-db76498edbd6",
       "title": "总部",
       "open":true,
       "pid": "00000000-0000-0000-0000-000000000000"
    }];
 
    formData = {
      act:'',
        selected:[]
    };

    constructor(private service:SysRoleService,
        private toastService:ToastService,
        private sysDeptService:SysDeptService,
        private changeDetectorRef: ChangeDetectorRef){
    }

    ngOnInit(): void {
      this.formData.act=this.data.act;
    }

    showToast(type, msg) {
        const results = this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }

    onLoading(){
          let root=this.operableTree.treeFactory.treeRoot[0];
          this.sysDeptService.getDeptTree((res)=>{
          if(res.code===200){

            this.operableTree.appendTreeItems(res.value.children,root.id);

            this.changeDetectorRef.markForCheck();

           if(this.formData.act==='edit' && this.data.right){
            this.data.right.forEach((el)=>{
              this.operableTree.treeFactory.checkNodesById(el.relate_id,true);
            });
           }

          }else{
            console.log(res);
          }
         });
    }

    close($event) {
        this.handler($event);
    }
    ngAfterViewInit(){
        this.onLoading();
     }

     getCheckedNodes(tree){
      let arry=[];
      tree.forEach(el => {
        if(!el.data.isParent){
          arry.push({ id:el.id,value:'Query:Add:Update:Delete'});
        }
      });
      return arry;
     }

     onOperableNodeChecked(tree){
        this.formData.selected=this.getCheckedNodes(tree);
        //console.log(tree);
      if(this.formData.selected.length>0){
        this.data.canConfirm(true);
      }else{
        this.data.canConfirm(false);
      }
     }
}