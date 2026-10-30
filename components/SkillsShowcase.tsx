import type { CSSProperties } from "react";

const skillGroups = [
  {
    title: "Technical skills",
    eyebrow: "Building the product",
    skills: [
      ["JavaScript", 95],
      ["React", 90],
      ["Node.js", 85],
      ["TypeScript", 80],
      ["Dev-ops", 55],
      ["Cloud related skills", 30],
      ["Database management", 80],
      ["Next.js", 90],
      ["HTML/CSS", 95],
    ],
  },
  {
    title: "Soft skills",
    eyebrow: "Making the work better",
    skills: [
      ["Problem solving", 90],
      ["Communication", 80],
      ["Teamwork", 90],
      ["Time management", 80],
    ],
  },
] as const;

export default function SkillsShowcase() {
  return (
    <div className="skills-grid">
      {skillGroups.map((group, groupIndex) => (
        <article className="skills-panel" key={group.title}>
          <div className="skills-panel-heading">
            <span className="skills-index">0{groupIndex + 1}</span>
            <div>
              <p className="skills-eyebrow">{group.eyebrow}</p>
              <h3>{group.title}</h3>
            </div>
          </div>
          <div className="skills-list">
            {group.skills.map(([name, percentage]) => (
              <div className="skill-item" key={name}>
                <div className="skill-label">
                  <span>{name}</span>
                  <span className="skill-percentage">{percentage}%</span>
                </div>
                <div
                  className="skill-track"
                  role="meter"
                  aria-label={name}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentage}
                >
                  <span
                    className="skill-progress"
                    style={
                      { "--skill-level": `${percentage}%` } as CSSProperties
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
