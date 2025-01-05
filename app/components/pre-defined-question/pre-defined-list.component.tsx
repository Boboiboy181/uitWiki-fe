import PreDefinedItem from './pre-defined-item.component';

export default function PreDefinedList() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-fit items-center justify-center gap-2 overflow-x-auto">
        {predefinedQuestions.map((item, index) => (
          <PreDefinedItem key={index} question={item.question} />
        ))}
      </div>
    </div>
  );
}

const predefinedQuestions = [
  { question: 'Bạn là ai?' },
  { question: 'Điều kiện xét tốt nghiệp của sinh viên ngành TMĐT' },
  { question: 'Một học kỳ được đăng ký tối đa bao nhiêu tín chỉ?' },
];
