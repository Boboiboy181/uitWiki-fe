import PreDefinedItem from './pre-defined-item.component';

export default function PreDefinedList() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      {predefinedQuestions.map((item, index) => (
        <PreDefinedItem key={index} question={item.question} />
      ))}
    </div>
  );
}

const predefinedQuestions = [
  { question: 'Bạn là ai?' },
  { question: 'Điều kiện xét tốt nghiệp của sinh viên ngành TMĐT' },
  { question: 'Một học kỳ được đăng ký tối đa bao nhiêu tín chỉ?' },
];
