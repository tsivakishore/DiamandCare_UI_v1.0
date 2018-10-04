import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { TranslateService } from "../../utility/translate/translate.service";
import { TreeViewDataService } from "../../utility/shared-service/treeviewdata.service";
import * as d3 from 'd3';

@Component({
  selector: 'app-underuserdetails',
  templateUrl: './underuserdetails.component.html',
  styleUrls: ['./underuserdetails.component.css'],
  providers: [TreeViewDataService],
  encapsulation: ViewEncapsulation.None
})
export class UnderuserdetailsComponent extends BaseComponent implements OnInit {

  lstTreeData: any[] = [];
  lstTreeChildData: any[] = [];
  userID: number;
  UserDetails: any;
  selectedNode: any;
  userIDInt: any;
  flag: boolean = false;

  constructor(private sharedService: SharedService,
    private treeViewDataService: TreeViewDataService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.UserDetails = this.sharedService.getUser();
    this.userID = this.UserDetails.UserID;
    this.getTreeViewData(this.userID);

  }

  public getTreeViewData(userID: number) {
    this.sharedService.setLoader(true);
    this.treeViewDataService._getTreeViewData(userID).then((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstTreeData = res.m_Item3;
        //this.generateTree(this.lstTreeData); 
        this.generateTree();
        console.log(this.lstTreeData);
      }
      else {
        this.lstTreeData = [];
      }

    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }



  generateTree() {

    var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      g = svg.append("g").attr("transform", "translate(" + (width / 2 + 40) + "," + (height / 2 + 90) + ")");


    var tree = d3.tree()
      .size([2 * Math.PI, 500])
      .separation(function (a, b) { return (a.parent == b.parent ? 1 : 1) / a.depth; });

    var root = tree(d3.hierarchy(this.lstTreeData[0]));
    //var root = tree(d3.hierarchy(jsonObj));


    var link = g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link_continuous")
      .attr("d", d3.linkRadial()
        .angle(function (d) { return d.x; })
        .radius(function (d) { return d.y; }));

    var node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function (d) { return "translate(" + radialPoint(d.x, d.y) + ")"; })
      .on("click", click)														//added mouseover function
      .on("mouseover", function (d) {
        var g = d3.select(this); // The node
        // The class is used to remove the additional text later
        var info = g.append('text')
          .classed('info', true)
          .attr('x', 20)
          .attr('y', 10)
          .text('More info');
      })
      .on("mouseout", function () {
        // Remove the info text on mouse out.
        d3.select(this).select('text.info').remove()
      });

    node.append("circle")
      .attr("r", 5)
      .style("fill", findColour)


    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", function (d) { return d.x < Math.PI === !d.children ? 6 : -6; })
      .attr("text-anchor", function (d) { return d.x < Math.PI === !d.children ? "start" : "end"; })
      .attr("transform", function (d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
      .text(function (d) { return d.data.name; });


    function radialPoint(x, y) {
      return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    }

    /*find color*/
    function findColour(d) {
      return d.data.styleClass;
    }
    // Toggle children on click.
    function click(d) {
      this.userIDInt = d.data.UserID;
      //this.getChildTreeViewData();
      console.log(this.userIDInt);
      this.flag = true;
    }
  }

  public getChildTreeViewData() {
    console.log(this.userIDInt);
    this.sharedService.setLoader(true);
    this.treeViewDataService._getTreeViewData(this.userIDInt).then((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstTreeChildData = res.m_Item3;
        this.flag = true;
      }
      else {
        this.lstTreeChildData = [];
      }

    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

}
