import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import { SysMenu } from 'src/app/@core/data/sysmenu';
import { SysMenuService } from 'src/app/@core/services/sysmenu.service';
import { DialogService, LoadingService, LoadingType, OperableTreeComponent, ToastService } from 'ng-devui';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/@core/services/auth.service';
import { Router } from '@angular/router';
import { DialogMenuComponent } from 'src/app/@shared/components/dialog-menu/cdialog.component';
@Component({
    selector: 'list-app-sysmenu-menu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./menu.component.scss'],
    templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
 
    iconParentOpen = '<span class="icon icon-chevron-down"></span>';
    iconParentClose = '<span class="icon icon-collapse"></span>';
    disableMouseEvent = false;
    currentSelectedNode;

    showLoading: boolean;
    loading: LoadingType;
    busy: Subscription;
    waittingRt: any;
    
    formData={};

    @ViewChild('operableTree', { static: true }) operableTree: OperableTreeComponent;
    dataSource =  [{
       "id": "1a75be74-0aaf-40f0-b446-2aef1884a63b",
       "title": "系统菜单",
       "link": "/",
       "open":true,
       "data":{"icon":"icon-system"},
       "pid": "00000000-0000-0000-0000-000000000000"
    }];
 
    constructor(private sysMenuService: SysMenuService,
        private toastService:ToastService,
        private loadingService:LoadingService,
        private changeDetectorRef: ChangeDetectorRef,
        private dialogService:DialogService) {

            this.loading = new Observable((function (observer) {
                if (this.complete) {
                    observer.onNext(this.complete);
                    observer.onCompleted();
                }
            }).bind(this));
    }
    ngOnInit() {
      
    }

    showToast(type, msg) {
       this.toastService.open({
            value: [{ severity: type, summary: '提示', content: msg }],
        });
    }
    onToggle($event, node) {
        if ($event && node.data.isHover) {
           this.disableMouseEvent = true;
        } else {
          node.data.isHover = false;
          this.disableMouseEvent = false;
        }
      }
 
    activeNode(node) {
      this.operableTree.treeFactory.activeNodeById(node.id);
    }

    onLoading(){

      if(this.showLoading)return;

        this.showLoading=true;
        this.waittingRt = this.loadingService.open();
        let root=this.operableTree.treeFactory.treeRoot[0];
 
        this.sysMenuService.getSources(null,null,(res)=>{
        this.showLoading=false;
        this.waittingRt.loadingInstance.close();

        if(res.code===200){

          this.operableTree.appendTreeItems(res.value.children,root.id);

          // this.operableTree.treeFactory.mapTreeItems({
          //   treeItems:res.value.items,
          //   parentId:root.id
          // });
          // this.operableTree.treeFactory.endLoading(root.id);
          //this.dataSource.push(res.value);
          this.changeDetectorRef.markForCheck();
        }else{
          console.log(res);
        }
       });
    }     


    findParentNode(parentId){
      let v=this.operableTree.treeFactory.nodes[parentId];
      if(v)return v;
      return null;
    }

     addOrUpdate(act,node){
      let pid=node.parentId;
      let parentName='';

      if (act==='edit' && (pid===undefined || pid===null)){
        this.showToast('warning','节点不能修改');
        return;
      }

      if(act==='edit'){
        let v=this.findParentNode(pid);
        if(v)parentName=v.data.title;
      }

      let results=this.dialogService.open({
        id: 'menu-dialog',
        width: '582px',
        maxHeight: '360px',
        title:act==='add'?'添加菜单':'修改菜单',
        content:  DialogMenuComponent,
        backdropCloseable: true,
        data:act==='add'? {
            id: '', pid:node.id, parent:node.data.title,
            menu_name:'', menu_uri:'', mindex:0,icon:''
        }:{
            id: node.id,
            pid:pid,
            parent:parentName,
            menu_name:node.data.title,
            menu_uri:node.data.originItem.link,
            mindex:node.data.originItem.mindex,
            icon:node.data.originItem.data.icon
        },
        dialogtype: 'standard',
        showAnimation: true,
        buttons: [
            {
                cssClass: 'primary',
                text: '确定',
                handler: ($event: Event) => {
                    results.modalInstance.hide();
                    var form = results.modalContentInstance.formData;
           
                    let item:SysMenu={
                        id:form.id,
                        pid:node.id,
                        menu_name:form.menu_name,
                        menu_uri:form.menu_uri,
                        menu_type:form.menutypevalue.id,
                        icon:form.icon,
                        mindex:form.mindex
                    };

                    this.waittingRt = this.loadingService.open();

                    if(act==="add"){
                      this.sysMenuService.add(item,(res)=>{
                          this.waittingRt.loadingInstance.close();
                          if(res.code===200){
                              this.showToast('success','添加成功,请刷新');
                          }else{
                              this.showToast('error',res.value);
                          }
                      });
                  }else{
                    this.sysMenuService.update(item,(res)=>{
                      this.waittingRt.loadingInstance.close();
                      if(res.code===200){
                          this.showToast('success','修改成功,请刷新');
                      }else{
                          this.showToast('error',res.value);
                      }
                  });
                  }
                },
            },
            {
                id: 'btn-grant-cancel',
                cssClass: 'common',
                text: '取消',
                handler: ($event: Event) => {
                    results.modalInstance.hide();
                },
            },
        ],
    });
     }

     deleteRow(row:any) {
      const results = this.dialogService.open({
          id: 'delete-warning-dialog',
          width: '400px',
          maxHeight: '270px',
          html: true,
          content: '<div style="color:#8a6d3b;">确定要删除该数据吗?</div>',
          backdropCloseable: true,
          dialogtype: 'warning',
          buttons: [
              {
                  btnwidth: '84px',
                  cssClass: 'primary',
                  text: '确定',
                  autofocus: true,
                  handler: ($event: Event) => {
                      results.modalInstance.hide();
                      this.waittingRt = this.loadingService.open();

                      this.sysMenuService.delete(row,(res)=>{
                              this.waittingRt.loadingInstance.close();
                              if(res.code===200){
                                  this.showToast('success','删除成功');
                                  this.operableTree.treeFactory.deleteNodeById(row.id);
                              }else{
                                  this.showToast('error',res.value);
                              }
                      });
                  },
              },
              {
                  id: 'btn-del-cancel',
                  cssClass: 'common',
                  text: '取消',
                  handler: ($event: Event) => {
                      results.modalInstance.hide();
                  },
              },
          ],
      });
   }
     addNode(event,node) {
      this.addOrUpdate('add',node);

       //if (this.currentSelectedNode) {
        //  const node = this.operableTree.treeFactory.addNode({ parentId: this.currentSelectedNode.id, title: '新增一个节点' });
        //  this.currentSelectedNode.data.isOpen = true;
        //  console.log(node);
       //}
     }
     editNode(event,node){
       this.addOrUpdate('edit',node);
     }

     deleteNode(event,node) {
      if(node.parentId===null || node.parentId===undefined){
        this.showToast('info','根节点不能删除');
        return;
      }
      if(node.data?.isParent){
        this.showToast('info','请先删除字节点');
        return;
      }

      this.deleteRow({
        id:node.id
      });

      //  if (this.currentSelectedNode) {
      //    this.operableTree.treeFactory.deleteNodeById(this.currentSelectedNode.id);
      //  } 
     }
     ngAfterViewInit(){
        this.onLoading();
     }
   }