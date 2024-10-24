import React, { useRef } from "react";

import Card from "../UI/Card";
import Login from "./LogIn";
import classes from "./info.module.css";

function Info(props) {
  const loginRef = useRef(null);

  const scrollToLoginHandler = () => {
    if (loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: "📤",
      title: "Create Your Own Schema Matching Task",
      description:
        "Easily upload CSV tables gathered from your database or any other source. Customize your task parameters to meet your specific needs.",
    },
    {
      icon: "🔍",
      title: "Automated Similarity Generation",
      description:
        "Our advanced algorithms automatically generate similar pairs based on attributes and schema similarities, streamlining your data analysis process.",
    },
    {
      icon: "✅",
      title: "Crowd Verification",
      description:
        "The crowd will help you check the accuracy of the results, ensuring quality and reliability in schema matching.",
    },
    {
      icon: "👥",
      title: "Collaborate and Contribute",
      description:
        "Engage with a vibrant community of data enthusiasts and researchers. Contribute as a worker to help others with their tasks, fostering collaboration and knowledge sharing.",
    },
  ];

  return (
    <div className={classes.container}>
      <section className={classes.welcome}>
        <h1>
          Welcome to <strong>Crowdie!</strong>
        </h1>
        <div>
        <p>
          Help the data community by providing labeled datasets for schema
          matching through our platform.
        </p>
        <h3
          className={classes.scrollLink}
          onClick={scrollToLoginHandler}
          role="button"
          aria-label="Scroll to login section"
        >
          Join us in building a smarter data ecosystem!
        </h3>
        </div>
      </section>

      <section className={classes.features}>
        <h2>Key Features of Crowdie</h2>
        <div className={classes.cardsContainer}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section ref={loginRef} className={classes.login}>
        <h3>Login or Create a new account to get started.</h3>
        <Login onSignUp={props.onSignUp} />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className={classes.featuresCard}>
      <div className={classes.cardHeader}>
        {icon} <h3>{title}</h3>
      </div>
      <p>{description}</p>
    </Card>
  );
}

export default Info;
