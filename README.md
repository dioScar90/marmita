# Marmita

This is an web app I developed to help me in doing the lunch orders of mine and of the job's collegues of mine.

Want to mock your data manually? Copy/paste it on your browser console and write the names you want passing as a parameter `values: string[]` of `mockData`'s function:

```
const mockData = (values) => {
  const names = []

  for (const name of values) {
    const isActive = true
    const id = self.crypto.randomUUID()
    const newName = { id, name, isActive }

    names.push(newName)
  }

  localStorage.setItem('names', JSON.stringify(names))
}

const names = [
  // Type here the names you want to mock...
]

mockData(names.sort())
```

Replace _// Type here the names you want to mock..._ by the names you want to mock.

Now you can order your lunch, and also add/remove or enable/disable names. :)