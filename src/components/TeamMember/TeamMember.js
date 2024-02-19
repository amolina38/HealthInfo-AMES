import './index.css';

export default function TeamMember(props) {
  return (
    <div className="team-member">
      <img src={props.imagePath} alt="user-img"/>
      <p>{props.name}: {props.role}</p>
    </div>
  )
}
