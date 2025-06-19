import { useEffect, useState } from "react";
import { Container, Button, Row, Col, Table, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../axiosConfig";
  
function AdminHome() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const [releaseStatus, setReleaseStatus] = useState(null);


  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await instance.get("/test/allTests");
        setTests(res.data.tests);
        
      } catch (error) {
        console.error("Failed to fetch tests", error);
      }
    }
    fetchTests();
  }, []);

  const handleReleasedToggle = async (test) => {
    try {
      const updatedTest = {
        ...test,
        released: !test.released,
      };
      

      await instance.put(`/test/update/${test._id}`, updatedTest);

      setTests((prev) =>
        prev.map((t) => (t._id === test._id ? updatedTest : t))
      );

      setReleaseStatus(updatedTest.released ? "Test released" : "Test unreleased ");
    } catch (error) {
      console.error("Failed to update release status", error);
      setReleaseStatus(" Failed to update release status");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      await instance.delete(`/test/delete/${id}`);
      setTests((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Failed to delete test", error);
    }
  };
  useEffect(() => {
  if (releaseStatus) {
    const timer = setTimeout(() => {
      setReleaseStatus(null);
    }, 3000); 

    return () => clearTimeout(timer);
  }
}, [releaseStatus]);
  return (
    <Container className="py-4" style={{marginTop:"100px"}}>
      <h1 className="mb-4">Admin Dashboard</h1>
      <Row className="mb-4">
        <Col xs="auto">
          <Button as={Link} to="/admin/create/test" variant="primary">
            Create Test
          </Button>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/admin/fetch/students" variant="success">
            View Student Details
          </Button>
        </Col>
        <Col xs="auto">
    <Button as={Link} to="/admin/tests" variant="dark">
      View Student Results
    </Button>
  </Col>
      </Row>
      {releaseStatus && (
  <div className="mb-3">
    <div className={`alert ${releaseStatus.includes("Failed") ? "alert-danger" : releaseStatus.includes("unreleased") ? "alert-warning" : "alert-success"}`} role="alert">
      {releaseStatus}
    </div>
  </div>
)}


      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Questions</th>
            <th>Duration (mins)</th>
            <th>Released</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tests) && tests.length > 0 ? (
            tests.map((test) => (
              <tr key={test._id}>
                <td>{test.title}</td>
                <td>{test.numQuestions}</td>
                <td>{test.duration}</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={test.released}
                    onChange={() => handleReleasedToggle(test)}
                  />
                </td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => navigate(`/admin/update/test/${test._id}`)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => navigate(`/admin/view/test/${test._id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(test._id)}
                  >Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No tests found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminHome;
