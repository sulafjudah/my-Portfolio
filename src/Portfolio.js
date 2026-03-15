import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import './Portfolio.css';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { scrollYProgress } = useScroll();

  return (
    <div style={{ position: 'relative', backgroundColor: '#0a192f', color: '#f1f5f9', overflowX: 'hidden' }}>
      <BackgroundParticles />
      <Navigation activeSection={activeSection} />
      <ScrollProgress scrollYProgress={scrollYProgress} />
      
      <HeroSection setActiveSection={setActiveSection} />
      <AboutSection setActiveSection={setActiveSection} />
      <SkillsSection setActiveSection={setActiveSection} />
      <ProjectsSection setActiveSection={setActiveSection} />
      <ExperienceSection setActiveSection={setActiveSection} />
      <ContactSection setActiveSection={setActiveSection} />
    </div>
  );
};

//Scroll Progress Bar
const ScrollProgress = ({ scrollYProgress }) => {
  return (
    <motion.div 
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

//Background Particles
const BackgroundParticles = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = ['#f59e0b', '#06b6d4', '#ff6b6b'][Math.floor(Math.random() * 3)];
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();
        
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - distance / 120) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <canvas ref={canvasRef} className="particles-canvas" />;
};

//Navigation
const Navigation = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];
  
  return (
    <motion.nav 
      className={`navigation ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <motion.div 
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
        >
          <span className="gradient-text">{'<Sulaf Judah />'}</span>
        </motion.div>
        
        <div className="nav-items">
          {navItems.map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`nav-item ${activeSection === item.toLowerCase() ? 'active' : ''}`}
              whileHover={{ y: -2 }}
            >
              {item}
              {activeSection === item.toLowerCase() && (
                <motion.div 
                  className="nav-item-underline"
                  layoutId="activeSection"
                />
              )}
            </motion.a>
          ))}
        </div>
        
        <a href='https://github.com/sulafjudah' target='_blank'>
        <motion.button 
          className="nav-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Resume
        </motion.button>
        </a>
      </div>
    </motion.nav>
  );
};

//Animation Component
const TypingAnimation = ({ texts }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentText = texts[currentTextIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((currentTextIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex, texts]);
  
  return (
    <span>
      {displayText}
      <span className="animate-pulse" style={{ color: '#f59e0b' }}>|</span>
    </span>
  );
};

// Hero Section
const HeroSection = ({ setActiveSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  
  useEffect(() => {
    if (isInView) setActiveSection('home');
  }, [isInView, setActiveSection]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  return (
    <section id="home" ref={ref} className="hero-section">
      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-badge">
          <span>Computer Science Student • Data Analyst • Developer</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="hero-title">
          <span className="hero-title-line1">Hi, I'm</span>
          <span className="hero-title-line2">Sulaf Mohammad AbdElHameed Judah</span>
        </motion.h1>
        
        <motion.div variants={itemVariants} className="hero-subtitle">
          <TypingAnimation 
            texts={[
              "Aspiring Data Analyst",
              "Software Engineer in Making",
              "Problem Solver",
              "Code Craftsman"
            ]} 
          />
        </motion.div>
        
        <motion.p variants={itemVariants} className="hero-description">
          Transforming data into insights and ideas into elegant solutions. 
          Building the bridge between analytics and engineering.
        </motion.p>
        
        <motion.div variants={itemVariants} className="hero-buttons">
          <motion.a
            href="#projects"
            className="btn btn-primary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          
          <motion.a
            href="https://www.linkedin.com/in/su-j01"
            target="_blank"
            className="btn btn-outline"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.a>
        </motion.div>
        
        <motion.div variants={itemVariants} className="hero-socials">
          {['GitHub'].map((social) => (
            <motion.a
              key={social}
              target="_blank"
              href="https://github.com/sulafjudah"
              className="social-link"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {social[0]}
            </motion.a>
          ))}

          {['LinkedIn'].map((social) => (
            <motion.a
              key={social}
              target="_blank"
              href="https://www.linkedin.com/in/su-j01"
              className="social-link"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {social[0]}
            </motion.a>
          ))}

          {['Email'].map((social) => (
            <motion.a
              key={social}
              target="_blank"
              href="mailto:sulafjudah@gmail.com"
              className="social-link"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {social[0]}
            </motion.a>
          ))}

          {['Upwork'].map((social) => (
            <motion.a
              key={social}
              target="_blank"
              href="https://www.upwork.com/freelancers/~0167005ff8854279c5?mp_source=share"
              className="social-link"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {social[0]}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="scroll-mouse">
          <motion.div 
            className="scroll-wheel"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

// About Section
const AboutSection = ({ setActiveSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (isInView) setActiveSection('about');
  }, [isInView, setActiveSection]);
  
  return (
    <section id="about" ref={ref} className="about-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="section-underline gradient-amber-orange" />
        </motion.div>
        
        <div className="about-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="about-image-container">
              <div className="about-image-glow" />
              <div className="about-image-card">
                <div className="about-image-placeholder">
                  <div className="about-image-initials">
                    
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="about-content"
          >
            <p className="about-text">
              I'm a passionate Computer Science student with a dual focus on 
              <span className="about-highlight"> data analytics</span> and 
              <span className="about-highlight-teal"> software engineering</span>. 
              My journey began with curiosity about how data drives decisions and how code brings ideas to life.
            </p>
            
            <p className="about-text">
              I thrive at the intersection of analytical thinking and creative problem-solving, 
              whether I'm uncovering insights from complex datasets or building elegant, user-centric applications.
            </p>
            
            <p className="about-text">
              For me, technology isn't just about writing code; it's about building tools, solving problems, and creating experiences that make a
               <span className="about-highlight-teal"> difference</span>.
            </p>


            <div className="about-stats">
              {[
                { number: '50+', label: 'Projects Completed' },
                { number: '15+', label: 'Technologies' },
                { number: '30+', label: 'Dashboards Built' },
                { number: '∞', label: 'Cups of Coffee' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-card"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Skills Section
const SkillsSection = ({ setActiveSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (isInView) setActiveSection('skills');
  }, [isInView, setActiveSection]);
  
  const skillCategories = [
    {
      title: 'Data Analytics',
      gradient: 'gradient-amber-orange',
      skills: [
        { name: 'Power BI', level: 95 },
        { name: 'Python', level: 90 },
        { name: 'SQL', level: 85 },
        { name: 'R', level: 15 },
        { name: 'Excel', level: 90 },
        { name: 'Tableau', level: 70 }
        
      ]
    },
    {
      title: 'Software Engineering',
      gradient: 'gradient-teal-cyan',
      skills: [
        { name: 'C#', level: 95 },
        { name: 'React', level: 88 },
        { name: 'Node.js', level: 79 },
        { name: 'JavaScript', level: 87 },
        { name: 'Git', level: 90 },
        { name: 'Flutter', level: 40 }
      ]
    },
    {
      title: 'Core Technologies',
      gradient: 'gradient-rose-pink',
      skills: [
        { name: 'HTML/CSS', level: 95 },
        { name: 'Algorithms', level: 50 },
        { name: 'Data Structures', level: 90 },
        { name: 'APIs', level: 35 },
        { name: 'Databases', level: 84 },
        { name: 'Cloud (AWS)', level: 53 }
      ]
    }
  ];
  
  return (
    <section id="skills" ref={ref} className="skills-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">
            <span className="gradient-text">Technical Arsenal</span>
          </h2>
          <div className="section-underline gradient-teal-cyan" />
        </motion.div>
        
        <div className="skills-grid">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="skill-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <h3 className={`skill-title ${category.gradient}`} style={{ 
                background: category.gradient.includes('amber') ? 'linear-gradient(to right, #f59e0b, #f97316)' :
                           category.gradient.includes('teal') ? 'linear-gradient(to right, #06b6d4, #22d3ee)' :
                           'linear-gradient(to right, #ff6b6b, #ec4899)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {category.title}
              </h3>
              
              <div className="skill-list">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name} className="skill-item-container">
                    <div className="skill-item-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar-bg">
                      <motion.div
                        className={`skill-bar-fill ${category.gradient}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: skillIndex * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Projects Section
const ProjectsSection = ({ setActiveSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (isInView) setActiveSection('projects');
  }, [isInView, setActiveSection]);
  
  const projects = [
    {
      title: 'Sales Analytics Dashboard',
      category: 'Data Analytics',
      description: 'Interactive dashboard analyzing 100K+ sales records with predictive insights.',
      tech: ['Python', 'Pandas', 'Plotly', 'SQL'],
      gradient: 'gradient-amber-orange',
      icon: '📊'
    },
    {
      title: 'E-Commerce Platform',
      category: 'Full-Stack',
      description: 'Complete e-commerce solution with payment integration and analytics.',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      gradient: 'gradient-teal-cyan',
      icon: '🛒'
    },
    {
      title: 'Customer Churn Prediction',
      category: 'Machine Learning',
      description: 'ML model predicting customer churn with 92% accuracy.',
      tech: ['Python', 'Scikit-learn', 'XGBoost', 'Flask'],
      gradient: 'gradient-rose-pink',
      icon: '🤖'
    },
    {
      title: 'Task Management App',
      category: 'Web Development',
      description: 'Collaborative task management with real-time updates.',
      tech: ['React', 'Firebase', 'Tailwind', 'Chart.js'],
      gradient: 'gradient-purple-indigo',
      icon: '✅'
    },
    {
      title: 'Financial Data Scraper',
      category: 'Automation',
      description: 'Automated system collecting financial data with scheduled reports.',
      tech: ['Python', 'BeautifulSoup', 'Selenium', 'PostgreSQL'],
      gradient: 'gradient-green-emerald',
      icon: '💰'
    },
    {
      title: 'Social Media Analytics',
      category: 'Data Visualization',
      description: 'Real-time sentiment analysis and engagement tracking.',
      tech: ['Python', 'NLP', 'D3.js', 'Redis'],
      gradient: 'gradient-blue-violet',
      icon: '📱'
    }
  ];
  
  return (
    <section id="projects" ref={ref} className="projects-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <div className="section-underline gradient-rose-pink" />
        </motion.div>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="project-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className={`project-gradient-overlay ${project.gradient}`} />
              
              <div className="project-content">
                <div className="project-icon">{project.icon}</div>
                <div className="project-category">{project.category}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
                
                <div className="project-buttons">
                  <motion.button
                    className={`project-btn ${project.gradient}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Project
                  </motion.button>
                  <motion.button
                    className="project-btn project-btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GitHub
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Experience Section
const ExperienceSection = ({ setActiveSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (isInView) setActiveSection('experience');
  }, [isInView, setActiveSection]);
  
  const experiences = [
    {
      year: 'Dec 2025',
      title: 'Data Analytics Intern',
      company: 'Digital Egypt Pioneers Initiative (DEPI)',
      description: 'Building and analyzing data solutions using Excel, SQL, and Power BI, creating 30+ interactive dashboards to uncover insights and support data-driven decision making.',
      gradient: 'gradient-amber-orange'
    },
    {
      year: '2025',
      title: 'Freelance Web Developer',
      company: 'Self-Employed',
      description: 'Developed multiple responsive web projects applying modern design patterns and performance-focused layouts.',
      gradient: 'gradient-teal-cyan'
    },
    {
      year: '2025',
      title: 'Mathematics Tutor',
      company: 'Online • Independent Instruction',
      description: 'Delivering personalized mathematics tutoring while studying computer science, helping students master core concepts and develop stronger analytical thinking.',
      gradient: 'gradient-rose-pink'
    },
    {
      year: '2024',
      title: 'Backend Development',
      company: 'Independent Projects',
      description: 'Continuously developing backend projects using C#, Python, and C to strengthen programming and system design skills..',
      gradient: 'gradient-purple-indigo'
    }
  ];
  
  return (
    <section id="experience" ref={ref} className="experience-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">
            <span className="gradient-text">Experience Timeline</span>
          </h2>
          <div className="section-underline gradient-purple-indigo" />
        </motion.div>
        
        <div className="timeline-container">
          <div className="timeline-line" />
          
          <div className="timeline-items">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className={`timeline-item ${index % 2 === 0 ? '' : 'reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="timeline-content">
                  <motion.div
                    className="timeline-card"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className={`timeline-year ${exp.gradient}`}>
                      {exp.year}
                    </div>
                    <h3 className="timeline-title">{exp.title}</h3>
                    <div className="timeline-company">{exp.company}</div>
                    <p className="timeline-description">{exp.description}</p>
                  </motion.div>
                </div>
                
                <motion.div
                  className={`timeline-dot ${exp.gradient}`}
                  whileHover={{ scale: 1.5 }}
                />
                
                <div className="timeline-spacer" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = ({ setActiveSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  useEffect(() => {
    if (isInView) setActiveSection('contact');
  }, [isInView, setActiveSection]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for data.');
  };
  
  return (
    <section id="contact" ref={ref} className="contact-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <div className="section-underline gradient-amber-orange" />
        </motion.div>
        
        <div className="contact-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="contact-info"
          >
            <div className="contact-intro">
              <h3>Ready to collaborate?</h3>
              <p>
                I'm always interested in hearing about new opportunities, whether it's data analysis projects, 
                software development roles, or innovative collaborations!
              </p>
            </div>
            
            <div className="contact-details">
              {[
                { icon: '📧', label: 'Email', value: 'sulafjudah@gmail.com' },
                { icon: '📍', label: 'Location', value: 'Mansoura, Egypt' },
                { icon: '💼', label: 'Status', value: 'Open to Opportunities' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="contact-item"
                  whileHover={{ x: 10 }}
                >
                  <div className="contact-icon">{item.icon}</div>
                  <div>
                    <div className="contact-label">{item.label}</div>
                    <div className="contact-value">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="contact-form"
          >
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                rows="5"
                className="form-textarea"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            
            <motion.button
              type="submit"
              className="form-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>
          </motion.form> */}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="footer"
        >
          <p>© 2026 Sulaf Judah. Built with React and Framer Motion.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;