/**
 * Created by yiting.wang on 2015/7/15.
 */
(function(uc){
    uc.util.LinkedList = function (){
        this.headNode = null;
    };

    jQuery.extend(uc.util.LinkedList.prototype,{
        createNode:function(data){
            //data = {key:key,data:data}
            var newNode = {prev:null,data:data,next:null};
            return newNode;
        },
        findNode:function(currentNode,key,type){
            while (currentNode && (currentNode.data.key != key || currentNode.data.type != type)) {
                currentNode = currentNode.next;
            }
            if(currentNode &&  (currentNode.data.key == key && currentNode.data.type == type)){
                return currentNode;
            }else{
                return null;
            }

        },
        allNodeLength:function(){
            var nodeLen = 1;
            var currentNode = this.headNode;
           while(currentNode && currentNode.next != null){
               var parentStatus = this.findParentsNodeStatus(currentNode);
               if(parentStatus && currentNode.data.isShow){
                   nodeLen ++;
               }
               currentNode = currentNode.next;
           }
            return nodeLen;
        },
        getNodeLength:function () {
           var nodeLen = 0;
            var currentNode = this.headNode;
            while(currentNode){
               if(currentNode.data.type){
                   var parentStatus = this.findParentsNodeStatus(currentNode);
                   if(parentStatus && currentNode.data.isShow){
                       nodeLen = nodeLen + 1;
                       if(currentNode.data.isOpen && (currentNode.data.isLoadedStaff || currentNode.data.page)){
                           nodeLen =  nodeLen + currentNode.data.departmentData.staffNumber;
                       }
                   }
               }
                currentNode = currentNode.next;
            }
            return nodeLen;
        },
        isExtNode:function(data,type){
            var isExt = false;
            for(var currentNode = this.headNode;currentNode;currentNode=currentNode.next){
                if(currentNode.data.key == data.key && currentNode.data.type == type){
                    isExt=true;
                    break;
                }
            }

            return isExt;

        },
        insertNode:function(data,key,type,parentType){
            if(this.isExtNode(data,type)){
                return;
            }
            var newNode = this.createNode(data);
            var current = this.findNode(this.headNode,key,parentType);
            if(current){
                newNode.next = current.next;
                newNode.prev = current;
                current.next = newNode;
            }

        },
        getLastChildNodeKey:function(parentKey,type){
            var currentNode = this.headNode;
            var lastPrevKey = null;
            var type = 0;
            while(currentNode && currentNode.next){
                if(currentNode.data.parentKey == parentKey && currentNode.next.data.parentKey != parentKey){
                    lastPrevKey = currentNode.data.key;
                    type = currentNode.data.type;
                    break;
                }
                currentNode = currentNode.next;
            }
            return {lastPrevKey:lastPrevKey,type:type};
        },
        removeNode:function(){
            var currNode = this.findNode(this.headNode,key);
            if (!(currNode.next == null)) {
                currNode.prev.next = currNode.next;
                currNode.next.prev = currNode.prev;
                currNode.next = null;
                currNode.prev = null;
            }
        },
        updateNode:function(key,newData,type){
            var current = this.findNode(this.headNode,key,type);
            if(current){
                current.data = newData;
            }

        },
        getNodes:function(currentNode,count,getData){
            var node = currentNode;
            while(node && getData.length != count){
                if(!node.data.parentKey){
                    getData.push(node.data);
                    node = node.next;
                }
                if (!node) {
                    break;
                }
                var parentStatus = this.findParentsNodeStatus(node);
                if(parentStatus && node.data.isShow){
                    getData.push(node.data);
                }
                node = node.next;
            }
            return getData;
        },
        findParentsNodeStatus:function(node){
            var status = node.data.isShow;

           while(node && node.data.parentKey){
               if(!node.data.isShow){
                   status = node.data.isShow;
                   break;
               }
               node = this.findNode(this.headNode,node.data.parentKey,1);
           }
            return status;
        },
        getChildNode:function(parentKey){
            var currentNode = this.headNode;
            var getData = [];
            while(currentNode){
               if(currentNode.data.parentKey == parentKey){
                   getData.push(currentNode.data);
               }
                currentNode = currentNode.next;
            }
            return getData;
        },
        hasChildNode:function(parentKey){
            var currentNode = this.headNode;
            var hasChild = false;
            while(currentNode){
                if(currentNode.data.parentKey == parentKey){
                    hasChild = true;
                    break;
                }
                currentNode = currentNode.next;
            }
            return hasChild;
        },
        getHasAttributeChildNodeLength:function(parentKey,attribute){
            var nodeLen = 1;
            var currentNode = this.headNode;
            while(currentNode && currentNode.next != null){
                if(currentNode.data.parentKey == parentKey && attribute in currentNode.data){
                    nodeLen ++;
                    // var parentStatus = this.findParentsNodeStatus(currentNode);
                    // if(parentStatus && currentNode.data.isShow){
                    //     nodeLen ++;
                    // }
                }
                currentNode = currentNode.next;
            }
            return nodeLen;
        },
        updateMoreNode:function(parentKey,attribute,value){
            var currentNode = this.headNode;
            while(currentNode){
                if(currentNode.data.parentKey == parentKey){
                    currentNode.data[attribute] = value;
                }
                currentNode = currentNode.next;
            }
        },
        getIndexNode:function(index){
            var currentNode = this.headNode;
            if(!index){
                return currentNode;
            }
            var dataIndex = 1;
            while(currentNode && index != dataIndex){
                var parentStatus = this.findParentsNodeStatus(currentNode);
                if(parentStatus && currentNode.data.isShow){
                    dataIndex ++;
                }
                currentNode = currentNode.next;
            }
            return currentNode;
        },
        updateNodeAttributes:function(attributes,key,value,type){
           var currentNode = this.headNode;
            if(!currentNode){
                return;
            }
            currentNode = this.findNode(currentNode,key,type);
            if(!currentNode){
               return;
            }
            var NodeData = currentNode.data;
            for(var attr in NodeData){
                for(var i = 0;i<attributes.length;i++){
                    if(attr == attributes[i]){
                        NodeData[attr] = value[i];
                        currentNode.data = NodeData;
                    }else{
                        if(typeof(NodeData[attr]) == "object"){
                            for(var childAttr in NodeData[attr]){
                                if(childAttr == attributes[i]){
                                    NodeData[attr][childAttr] = value[i];
                                    currentNode.data = NodeData;
                                }
                            }
                        }
                    }
                }

            }

        },
        updateAttributeNode:function(attributes,value,newValue){
            var currentNode = this.headNode;
            if(!currentNode){
                return;
            }

            while(currentNode){
                var NodeData = currentNode.data;
                for(var attr in NodeData){
                    for(var i = 0;i<attributes.length;i++){
                        if(attr == attributes[i] && NodeData[attr] == value[i]){
                            NodeData[attr] = newValue[i];
                            currentNode.data = NodeData;
                        }else{
                            if(typeof(NodeData[attr]) == "object"){
                                for(var childAttr in NodeData[attr]){
                                    if(childAttr == attributes[i] && NodeData[attr][childAttr] == value[i]){
                                        NodeData[attr][childAttr] = newValue[i];
                                        currentNode.data = NodeData;
                                    }
                                }
                            }
                        }
                    }

                }
                currentNode = currentNode.next;
            }
        },
        updateAllChildAttribute:function(parentId,oldAttribute,newAttribute,type){
            var parentKey = [],parentNode,node;
            parentNode = this.findNode(this.headNode,parentId,type);
            if(parentNode && parentNode.next){
                node = parentNode.next;
                while(node){
                    if($.inArray(parentId, node.data.allParentKey)>-1){
                        node.data[oldAttribute] = newAttribute;
                    }
                    node = node.next;
                }
            }

        },
        getStaffNumber :function(key){
            var nodeLen = 0;
            var currentNode = this.headNode;
            while(currentNode){
                if(currentNode.data.parentKey == key && currentNode.data.type == 0){
                    nodeLen = nodeLen + 1;
                }
                currentNode = currentNode.next;
            }
            return nodeLen;
        }
    });
})(uc);