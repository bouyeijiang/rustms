import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormLayout, OperableTreeComponent, ToastService } from 'ng-devui';
import { SysMenuService } from 'src/app/@core/services/sysmenu.service';
import { SysRoleService } from 'src/app/@core/services/sysrole.service';
import { SysDeptService } from 'src/app/@core/services/sysdept.service';
@Component({
    selector: 'dialog-role-detail',
    templateUrl: './cdialog.component.html',
    styleUrls: ['./cdialog.component.scss']
})
export class DialogRoleDetailComponent implements OnInit{
    @Input() data: any;
    @Input() handler: Function;
    layoutDirection: FormLayout = FormLayout.Vertical;
    iconParentOpen = '<span class="icon icon-chevron-down"></span>';
    iconParentClose = '<span class="icon icon-collapse"></span>';
    
    @ViewChild('operableTree', { static: true }) operableTree: OperableTreeComponent;
    dataSource =  [];
 
    formData = {
      act:'',
        selected:[]
    };

    constructor(private service:SysRoleService,
        private toastService:ToastService,
        private sysMenuService:SysMenuService,
        private sysDeptService:SysDeptService,
        private changeDetectorRef: ChangeDetectorRef){

        }

    ngOnInit(): void {
      this.formData.act=this.data.act;
      if(this.data.role_type===0){
        this.dataSource =  [ {
          "id": "1a75be74-0aaf-40f0-b446-2aef1884a63b",
          "title": "系统菜单",
          "link": "/",
          "open":true,
          "data":{"icon":"icon-system"},
          "pid": "00000000-0000-0000-0000-000000000000"
       }];

      }else{
        this.dataSource =  [{
          "id": "20404794-657e-433a-a635-db76498edbd6",
          "title": "总部",
          "open":true,
          "pid": "00000000-0000-0000-0000-000000000000"
       }];
      }
    }

    showToast(type, msg) {
       this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }

    onLoading(){
          let root=this.operableTree.treeFactory.treeRoot[0];

          if (this.data.role_type===0){
          this.sysMenuService.getSources(null,null,(res)=>{
          if(res.code===200){
            this.operableTree.appendTreeItems(res.value.children,root.id);
            this.changeDetectorRef.markForCheck();
            this.operableTree.treeFactory.disableAllNodesChecked(true);
            
           if(this.data.role_id){
              this.service.getRight(this.data.role_id,(rres)=>{
                if(rres.code===200){
                  rres.value.forEach((el)=>{
                    this.operableTree.treeFactory.checkNodesById(el.relate_id,true);
                  });
                }else{
                  this.showToast('error',rres.value);
                }
              });
           }
          }else{
            console.log(res);
            this.showToast('error',res.value);
          }
         });
        }
        else{
          this.sysDeptService.getDeptTree((res)=>{
            if(res.code===200){
              this.operableTree.appendTreeItems(res.value.children,root.id);
              this.changeDetectorRef.markForCheck();
              this.operableTree.treeFactory.disableAllNodesChecked(true);
              
             if(this.data.role_id){
                this.service.getRight(this.data.role_id,(rres)=>{
                  if(rres.code===200){
                    rres.value.forEach((el)=>{
                      this.operableTree.treeFactory.checkNodesById(el.relate_id,true);
                    });
                  }else{
                    this.showToast('error',rres.value);
                  }
                });
             }
            }else{
              console.log(res);
              this.showToast('error',res.value);
            }
           });
        }
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
          arry.push({ id:el.id,value:el.data.originItem.link});
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