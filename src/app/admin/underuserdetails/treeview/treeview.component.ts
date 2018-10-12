import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { SharedService } from "../../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../../utility/base-component/base.component";
import { APIManager } from "../../../utility/shared-service/apimanager.service";
import { TreeViewDataService } from "../../../utility/shared-service/treeviewdata.service";
import * as d3 from 'd3';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.css'],
  providers: [TreeViewDataService]
})
export class TreeviewComponent extends BaseComponent implements OnInit {

  @Input() userIDInt: any;

  lstChildTreeData: any[];

  constructor(private sharedService: SharedService,
    private treeViewDataService: TreeViewDataService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    super(toastr, vcr);
  }
  ngOnInit() {
    // this.getChildTreeViewData(this.userIDInt);
  }

  ngOnChanges() {
    if (!!this.userIDInt)
      this.getChildTreeViewData(this.userIDInt);
  }

  public getChildTreeViewData(userID: number) {
    this.sharedService.setLoader(true);
    this.treeViewDataService._getTreeViewData(userID).then((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstChildTreeData = res.m_Item3;
        this.generateTree();
      }
      else {
        this.lstChildTreeData = [];
      }

    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  generateTree() {

    var me = this

    d3.select("#viz").select("svg").remove();
    var svg = d3.select("#viz").append("svg:svg")
      .attr("width", 1200)
      .attr("height", 1300),
      g = svg.append("g").attr("transform", "translate(" + (1200 / 2 + 40) + "," + (1300 / 2 + 90) + ")");

    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "my-tooltip")//add the tooltip class


    var tree = d3.tree()
      .size([2 * Math.PI, 500])
      .separation(function (a, b) { return (a.parent == b.parent ? 1 : 1) / a.depth; });

    var root = tree(d3.hierarchy(this.lstChildTreeData[0]));
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
      .on('mouseover', function (d) {

        tooltip.style("visibility", "visible")
          //.text(d.data.name)
          .html(d.data.DcID + "<br/>" + d.data.FirstName + " " + d.data.LastName + "<br/>" + "Level: " + d.data.Level + "<br/>" + "Phone: " + d.data.PhoneNumber)
      })
      .on("mousemove", function () {
        return tooltip
          // .style("top", (d3.event.pageY - 40) + "px")
          // .style("left", (d3.event.pageX - 130) + "px");
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
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
      me.loadchildtochild(d.data.UserID);
    }

    function mouseover(d) {
      //debugger;
      d3.select(this).append("text")
        .attr("class", "hover")
        .text(d.data.name);
    }

    // Toggle children on click.
    function mouseout(d) {
      d3.select(this).select("text.hover").remove();
    }
  }

  public loadchildtochild(id: number): void {
    this.getChildTreeViewData(id);
  }
}
