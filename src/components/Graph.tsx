import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import './styles/Graph.css'

interface HierarchyNode {
  name: string // 节点名称
  version: string // 版本号
  children: HierarchyNode[] // 子节点
  hasCircularDependency?: boolean // 标记循环依赖
  hasDuplicateDependency?: boolean // 标记重复依赖
  totalDependencies: number // 依赖总数
}

function convertHierarchy(data: any, ancestors: string[] = []): HierarchyNode {
  const root: HierarchyNode = {
    name: data.name,
    version: data.version,
    children: [],
    totalDependencies: 0
  }

  let hasCircularDependency = false
  let hasDuplicateDependency = false

  if (data.dependecies && data.dependecies.length > 0) {
    const dependencyCountMap = new Map()
    data.dependecies.forEach((dep) => {
      if (dependencyCountMap.has(dep.name)) {
        dependencyCountMap.set(dep.name, dependencyCountMap.get(dep.name) + 1)
        hasDuplicateDependency = true
      } else {
        dependencyCountMap.set(dep.name, 1)
      }

      if (ancestors.includes(dep.name)) {
        hasCircularDependency = true
      }

      ancestors.push(dep.name)

      const childNode = convertHierarchy(dep, ancestors)
      root.children.push(childNode)

      if (childNode.children.length === 0) {
        root.totalDependencies += 1
      } else {
        root.totalDependencies += childNode.totalDependencies
      }

      ancestors.pop()
    })

    root.hasCircularDependency = hasCircularDependency
    root.hasDuplicateDependency = hasDuplicateDependency
  }

  return root
}

function mergeHierarchyData(dataObjects): HierarchyNode {
  const mergedRoot: HierarchyNode = {
    name: 'Project Name: ##########',
    version: '=====',
    children: [],
    totalDependencies: 0
  }

  dataObjects.forEach((data) => {
    const hierarchyData = convertHierarchy(data)
    mergedRoot.children.push(hierarchyData)
    mergedRoot.totalDependencies += hierarchyData.totalDependencies
  })
  return mergedRoot
}

function drawNodelinks(g, hierarchyData) {
  const format = d3.format(',')
  const nodeSize = 20
  const root = d3.hierarchy(hierarchyData).eachBefore(
    (
      (i) => (d) =>
        (d.index = i++)
    )(0)
  )
  const nodes = root.descendants()

  const columns = [
    {
      label: 'NPM PACKAGE ANALYZER',
      value: (d) => d.version,
      format,
      x: 150,
      render: null
    },
    {
      label: 'version',
      value: (d) => d.version,
      format,
      x: 500,
      render: (text) => text.data.version
    },
    {
      label: 'dependencies',
      value: (d) => d.hasCircularDependency,
      format,
      x: 600,
      render: (text) => text.data.totalDependencies
    }
  ]

  const link = g
    .append('g')
    .attr('class', 'links')
    .selectAll()
    .data(root.links())
    .join('path')
    .attr('fill', 'none')
    .attr('stroke', '#8758ff')
    .attr(
      'd',
      (d) => `
        M${d.source.depth * nodeSize},${d.source.index * nodeSize}
        V${d.target.index * nodeSize}
        h${nodeSize}
      `
    )

  const node = g
    .append('g')
    .attr('class', 'nodes')
    .selectAll()
    .data(nodes)
    .join('g')
    .attr('transform', (d) => `translate(0,${d.index * nodeSize})`)

  node
    .append('circle')
    .attr('cx', (d) => d.depth * nodeSize)
    .attr('r', 3)
    .attr('fill', (d) => (d.children ? '#8758ff' : '#aac4ff'))

  node
    .append('rect')
    .attr('x', (d) => d.depth * nodeSize + 6)
    .attr('y', -nodeSize / 2 + 3)
    .attr('width', (d) => d.data.name.length * 7.5)
    .attr('height', 15)
    .attr('fill', '#d2daff')
    .attr('stroke', 'black')
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('opacity', (d) => (d.depth == 0 ? 0 : 0.3))

  node
    .append('text')
    .attr('dy', '0.32em')
    .attr('x', (d) => d.depth * nodeSize + 8)
    .text((d) => d.data.name)
    .attr('fill', '#555')
    .attr('font-size', (d) => (d.depth == 0 ? '13px' : '12px'))
    .attr('font-weight', (d) => (d.depth == 0 ? 'bold' : 'normal'))

  node.append('title').text((d) =>
    d
      .ancestors()
      .reverse()
      .map((d) => d.data.name)
      .join('/')
  )

  for (const { label, value, format, x, render } of columns) {
    g.append('text')
      .attr('dy', '0.32em')
      .attr('y', -nodeSize)
      .attr('x', x)
      .attr('text-anchor', 'end')
      .attr('font-weight', 'bold')
      .attr('font-size', '12px')
      .attr('fill', '#8758ff')
      .text(label)

    node
      .append('text')
      .attr('dy', '0.32em')
      .attr('x', x)
      .attr('text-anchor', 'end')
      .attr('fill', '#555')
      .data(root.copy().sum(value).descendants())
      .attr('font-size', '12px')
      .attr('font-weight', (d) => (d.depth == 0 ? 'bold' : 'normal'))
      .text(render)
  }

  return g.node()
}

export default function Graph({ setTotalDependencies, setCircularDep, setRootChildren }) {
  const svgRef = useRef(null)
  const gRef = useRef(null)

  useEffect(() => {
    const svgElement = d3
      .select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')

    const gElement = svgElement
      .append('g')
      .attr('transform', `translate(${20},${40})`)
    gRef.current = gElement

    const fetchData = async () => {
      try {
        // const response = await fetch('http://localhost:3030')
        const response = await fetch('./result.json')
        const data = await response.json()

        const mergedHierarchyData = mergeHierarchyData([
          data[0],
          data[1],
          data[2],
          data[3],
          data[4]
        ])

        drawNodelinks(gElement, mergedHierarchyData)

        setTotalDependencies(mergedHierarchyData.totalDependencies)
        setCircularDep(mergedHierarchyData.hasCircularDependency)
        var rootChildren: string[] = []
        mergedHierarchyData.children.forEach((child) => {
          rootChildren.push(child.name)
        })
        setRootChildren(rootChildren)

        return data
      } catch (error) {
        console.error('Error fetching data:', error)
        return []
      }
    }
    fetchData()
  }, [])

  return (
    <div id="graph-pane">
      <svg ref={svgRef} id="graph-svg"></svg>
    </div>
  )
}
