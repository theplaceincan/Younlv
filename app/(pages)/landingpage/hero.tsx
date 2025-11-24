'use client';

import css from "./hero.module.css"
import { useEffect, useRef } from "react";
import Link from 'next/link';

const tools = [
  {
    title: 'Course Planner',
    description: 'Build your semester schedule',
    link: '/course',
    registration: true,
  },
  {
    title: 'Textbook Search',
    description: 'Find free textbook PDFs',
    link: '/textbook'
  },
  {
    title: 'Grade Calculator',
    description: 'Calculate GPA or what you need on finals',
    link: '/calculator'
  },
  {
    title: 'QR Code Generator',
    description: 'QR code generator for RSO\'s',
    link: '/qr'
  }
];

// const recentTools = [
//   // {
//   //   title: 'Course Planner',
//   //   description: 'Build your semester schedule',
//   //   link: '/course'
//   // },
// ];
export default function Hero() {

  return (
    <div className={css["container"]}>
      <div className={css["tools-container"]}>
        <p className={css["tools-container-title"]}>Tools</p>
        <div className={css["tool-cards-container"]}>
          {tools.map((tool) => (
            <Link key={tool.link} href={tool.link} className={css["tool-card"]}>
              <p className={css["tool-name"]}>{tool.title}</p>
              <p className={css["tool-desc"]}>{tool.description}</p>
              { tool.registration && (
                <p className={css["tool-warning"]}>Sign-in Required</p>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-5"></div>
      {/* {recentTools && recentTools.length > 0 && (
        <div className={css["tools-container"]}>
          <p className={css["tools-container-title"]}>Recent Tools</p>
          <div className={css["tool-cards-container"]}>
            {recentTools.map((tool) => (
              <Link key={tool.link} href={tool.link} className={css["tool-card"]}>
                <p className={css["tool-name"]}>{tool.title}</p>
                <p className={css["tool-desc"]}>{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )} */}
    </div>
  )
}