import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, Spinner, Table, Badge, Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "../all_login/AuthContext";
import { useLanguage } from "../all_login/LanguageContext";
import "../../assets/css/userleftnav.css";
import UserHeader from "./UserHeader";
import UserLeftNav from "./UserLeftNav";
import "./UserProfile.css";
import "./Timeschedule.css";

const Timeschedule = () => {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const { uniqueId } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [notification, setNotification] = useState(null);
  const [triggeredNotifications, setTriggeredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = useMemo(
    () => (language === "hi" ? ["??????", "???????", "??????", "???????", "????????"] : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
    [language]
  );

  const timeSlots = useMemo(
    () => ["08:00-09:00", "09:00-10:00", "10:00-10:15", "10:15-11:15", "11:15-12:15"],
    []
  );

  const taskTypes = useMemo(
    () => [
      { value: "study", label: language === "hi" ? "??????" : "Study", variant: "primary" },
      { value: "subject", label: language === "hi" ? "????" : "Subject", variant: "success" },
      { value: "play", label: language === "hi" ? "???" : "Play", variant: "warning" },
      { value: "project", label: language === "hi" ? "????????" : "Project", variant: "info" },
      { value: "break", label: language === "hi" ? "?????" : "Break", variant: "secondary" },
    ],
    [language]
  );

  const initialFormState = {
    title: "",
    day: days[0],
    time: timeSlots[0],
    type: "study",
    teacher: "",
    description: "",
  };

  const [formState, setFormState] = useState(initialFormState);

  const getTypeConfig = (type) => {
    const config = taskTypes.find((item) => item.value === type);
    return config || taskTypes[0];
  };

  const getDefaultTasks = () => [
    {
      id: 1,
      day: days[0],
      time: "08:00-09:00",
      title: { en: "Mathematics", hi: "????" },
      teacher: "Mr. Sharma",
      type: "subject",
      description: { en: "Work on algebra and geometry.", hi: "??????? ?? ???????? ?? ??? ?????" },
    },
    {
      id: 2,
      day: days[0],
      time: "09:00-10:00",
      title: { en: "Economics", hi: "???????????" },
      teacher: "Ms. Patel",
      type: "subject",
      description: { en: "Review demand and supply.", hi: "???? ?? ??????? ?? ??????? ?????" },
    },
    {
      id: 3,
      day: days[1],
      time: "10:15-11:15",
      title: { en: "Play Time", hi: "??? ?? ???" },
      teacher: "",
      type: "play",
      description: { en: "Take a break with outdoor activities.", hi: "????? ?????????? ?? ??? ????? ????" },
    },
    {
      id: 4,
      day: days[2],
      time: "11:15-12:15",
      title: { en: "Project Work", hi: "???????? ?????" },
      teacher: "Ms. Rao",
      type: "project",
      description: { en: "Build a small science project.", hi: "?? ???? ??????? ???????? ??????" },
    },
    {
      id: 5,
      day: days[3],
      time: "10:00-10:15",
      title: { en: "Short Break", hi: "???? ?????" },
      teacher: "",
      type: "break",
      description: { en: "Rest and recharge.", hi: "???? ???? ?? ?? ????? ??????? ?????" },
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTasks(getDefaultTasks());
    setLoading(false);
  }, [days]);

  useEffect(() => {
    const pad = (value) => String(value).padStart(2, "0");
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      tasks.forEach((task) => {
        const taskStart = task.time.split("-")[0];
        if (taskStart === currentTime && !triggeredNotifications.includes(task.id)) {
          setNotification({
            title: task.title[language] || task.title.en,
            day: task.day,
            time: task.time,
          });
          setTriggeredNotifications((prev) => [...prev, task.id]);
        }
      });
    };

    const interval = setInterval(checkNotifications, 30000);
    checkNotifications();
    return () => clearInterval(interval);
  }, [tasks, triggeredNotifications, language]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDragStart = (event, taskId) => {
    event.dataTransfer.setData("text/plain", taskId);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, day, time) => {
    event.preventDefault();
    const taskId = Number(event.dataTransfer.getData("text/plain"));
    if (!taskId) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              day,
              time,
            }
          : task
      )
    );
  };

  const handleFormChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setSelectedTask(null);
    setFormState({
      title: "",
      day: days[0],
      time: timeSlots[0],
      type: "study",
      teacher: "",
      description: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.title.trim()) {
      return;
    }

    if (selectedTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === selectedTask.id
            ? {
                ...task,
                day: formState.day,
                time: formState.time,
                type: formState.type,
                teacher: formState.teacher,
                title: { ...task.title, [language]: formState.title },
                description: { ...task.description, [language]: formState.description },
              }
            : task
        )
      );
      setNotification({
        title: language === "hi" ? "????? ????? ???? ???" : "Task updated",
        day: formState.day,
        time: formState.time,
      });
    } else {
      const newTask = {
        id: Date.now(),
        day: formState.day,
        time: formState.time,
        type: formState.type,
        teacher: formState.teacher,
        title: { en: formState.title, hi: formState.title },
        description: { en: formState.description, hi: formState.description },
      };
      setTasks((prev) => [...prev, newTask]);
      setNotification({
        title: language === "hi" ? "??? ????? ????? ???" : "New task added",
        day: formState.day,
        time: formState.time,
      });
    }
    resetForm();
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setFormState({
      title: task.title[language] || task.title.en,
      day: task.day,
      time: task.time,
      type: task.type,
      teacher: task.teacher,
      description: task.description[language] || task.description.en,
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (selectedTask?.id === taskId) {
      resetForm();
    }
    setNotification({
      title: language === "hi" ? "????? ??? ???? ???" : "Task removed",
      day: "",
      time: "",
    });
  };

  const buildCellTasks = (day, time) => tasks.filter((task) => task.day === day && task.time === time);

  return (
    <div className="dashboard-container">
      <UserLeftNav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <div className="main-content-dash">
        <UserHeader toggleSidebar={toggleSidebar} />

        <Container fluid className="dashboard-box mt-3">
          {loading ? (
            <div className="profile-loading">
              <Spinner animation="border" variant="primary" />
              <p>{language === "hi" ? "??? ????? ????? ?? ??? ??..." : "Preparing your timetable..."}</p>
            </div>
          ) : (
            <Row className="g-4">
              <Col lg={8}>
                <Card className="shadow-box timetable-card">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                      <div>
                        <h2 className="mb-1">{language === "hi" ? "????????" : "Time Schedule"}</h2>
                        <p className="text-muted mb-0">
                          {language === "hi"
                            ? "???? ???????? ?????, ???????? ???? ?? ??? ?? ??????? ??????? ?????"
                            : "Create your routine, move tasks easily, and receive reminders on time."}
                        </p>
                      </div>
                      <Badge bg="success" className="mt-3 mt-md-0">
                        {language === "hi" ? "????? ??? ????? ?????" : "Drag & Drop Enabled"}
                      </Badge>
                    </div>

                    {notification && (
                      <Alert variant="info" dismissible onClose={() => setNotification(null)}>
                        <strong>{notification.title}</strong>
                        <div className="small">
                          {notification.day && notification.time
                            ? `${notification.day} • ${notification.time}`
                            : language === "hi" ? "????? ?? ?? ??? ?????" : "Updated schedule"}
                        </div>
                      </Alert>
                    )}

                    <div className="table-responsive timetable-wrapper">
                      <Table bordered hover className="timetable-grid mb-0">
                        <thead>
                          <tr>
                            <th className="time-header">{language === "hi" ? "???" : "Time"}</th>
                            {days.map((day) => (
                              <th key={day}>{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {timeSlots.map((slot) => (
                            <tr key={slot}>
                              <td className="time-cell">{slot}</td>
                              {days.map((day) => (
                                <td
                                  key={`${day}-${slot}`}
                                  className="schedule-cell"
                                  onDragOver={allowDrop}
                                  onDrop={(event) => handleDrop(event, day, slot)}
                                >
                                  <div className="cell-drop-zone">
                                    {buildCellTasks(day, slot).length > 0 ? (
                                      buildCellTasks(day, slot).map((task) => {
                                        const typeConfig = getTypeConfig(task.type);
                                        return (
                                          <Card
                                            key={task.id}
                                            className="task-card mb-2"
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, task.id)}
                                          >
                                            <Card.Body className="p-3">
                                              <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                  <h6 className="mb-1 task-title">{task.title[language] || task.title.en}</h6>
                                                  <p className="text-muted small mb-2">{task.teacher || (language === "hi" ? "??? ?????? ????" : "No teacher assigned")}</p>
                                                </div>
                                                <Badge bg={typeConfig.variant} className="task-badge">
                                                  {typeConfig.label}
                                                </Badge>
                                              </div>
                                              <div className="task-actions mt-2 d-flex justify-content-between gap-2">
                                                <Button size="sm" variant="outline-secondary" onClick={() => handleEditTask(task)}>
                                                  {language === "hi" ? "???????" : "Edit"}
                                                </Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDeleteTask(task.id)}>
                                                  {language === "hi" ? "?????" : "Delete"}
                                                </Button>
                                              </div>
                                            </Card.Body>
                                          </Card>
                                        );
                                      })
                                    ) : (
                                      <div className="empty-slot-text">
                                        {language === "hi" ? "????? ???? ?? ??? ??????" : "Drop here or add new"}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="shadow-box form-card mb-3">
                  <Card.Body>
                    <h5 className="mb-3">{language === "hi" ? "??????? ???????" : "Activity Manager"}</h5>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>{language === "hi" ? "??????? ??????" : "Activity Title"}</Form.Label>
                        <Form.Control
                          type="text"
                          value={formState.title}
                          placeholder={language === "hi" ? "???. ????" : "e.g. Maths"}
                          onChange={(e) => handleFormChange("title", e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>{language === "hi" ? "???" : "Day"}</Form.Label>
                        <Form.Select value={formState.day} onChange={(e) => handleFormChange("day", e.target.value)}>
                          {days.map((day) => (
                            <option value={day} key={day}>
                              {day}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>{language === "hi" ? "??? ?????" : "Time Slot"}</Form.Label>
                        <Form.Select value={formState.time} onChange={(e) => handleFormChange("time", e.target.value)}>
                          {timeSlots.map((slot) => (
                            <option value={slot} key={slot}>
                              {slot}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>{language === "hi" ? "??????" : "Type"}</Form.Label>
                        <Form.Select value={formState.type} onChange={(e) => handleFormChange("type", e.target.value)}>
                          {taskTypes.map((item) => (
                            <option value={item.value} key={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>{language === "hi" ? "??????" : "Teacher"}</Form.Label>
                        <Form.Control
                          type="text"
                          value={formState.teacher}
                          placeholder={language === "hi" ? "???. ??? ????" : "e.g. Ms. Patel"}
                          onChange={(e) => handleFormChange("teacher", e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>{language === "hi" ? "?????" : "Description"}</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={formState.description}
                          placeholder={language === "hi" ? "???????? ???????" : "Additional details"}
                          onChange={(e) => handleFormChange("description", e.target.value)}
                        />
                      </Form.Group>

                      <div className="d-flex gap-2 flex-wrap">
                        <Button type="submit" variant="primary" className="flex-fill">
                          {selectedTask ? (language === "hi" ? "??????" : "Save") : (language === "hi" ? "?????" : "Add")}
                        </Button>
                        <Button variant="outline-secondary" onClick={resetForm} className="flex-fill">
                          {language === "hi" ? "?????" : "Reset"}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>

                <Card className="shadow-box info-card">
                  <Card.Body>
                    <h5 className="mb-3">{language === "hi" ? "?????" : "Tips"}</h5>
                    <ul className="timeline-list">
                      <li>{language === "hi" ? "????? ???????? ???? ????? ?? ????? ???????? ???? ??? ??? ???? ???" : "A daily routine helps you stay focused on your studies."}</li>
                      <li>{language === "hi" ? "????? ?? ????? ???? ???? ??? ?? ????? ????????? ?????" : "Drag tasks to organize your day instantly."}</li>
                      <li>{language === "hi" ? "??????, ??? ?? ????? ?? ?????? ???? ?????" : "Balance study, play, and rest."}</li>
                      <li>{language === "hi" ? "??????? ???? ??? ?? ??? ?????? ??? ??? ???? ????" : "Notifications remind you at the right time."}</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Timeschedule;
