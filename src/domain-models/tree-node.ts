// Imports view models
import { TreeNode as ViewModelTreeNode } from './../view-models/tree-node';

export class TreeNode {

    constructor(public id: string, public name: string, public children: TreeNode[]) {
        
    }

    public toViewModelTreeNode(): ViewModelTreeNode {
        return new ViewModelTreeNode(this.id, this.name, this.children? this.children.map((x) => x.toViewModelTreeNode()) : undefined);
    }
}